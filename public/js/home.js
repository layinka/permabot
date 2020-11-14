const arweave = Arweave.init();
arweave.network.getInfo().then(console.log);
const community22 = new Community(arweave);

angular.module('homeApp', ['ngAnimate', 'ui.bootstrap', 'angularFileUpload'])
    .directive('decimalPlaces', function () {
        return {
            link: function (scope, ele, attrs) {
                ele.bind('keypress', function (e) {
                    var newVal = $(this).val() + (e.charCode !== 0 ? String.fromCharCode(e.charCode) : '');
                    if ($(this).val().search(/(.*)\.[0-9][0-9]/) === 0 && newVal.length > $(this).val().length) {
                        e.preventDefault();
                    }
                });
            }
        };
    })
    .controller('HomeController', function ($scope, $http, $window, $timeout, $uibModal) {
        var homeCtrl = this;

        let KEYNAME="arKey";

        homeCtrl.shifts = [];

        homeCtrl.secureLocalStorage = new SecureLS({encodingType: 'aes'});      

        homeCtrl.wallet = null;

        homeCtrl.initialize = async function () {
            
            let url =  '/pending';
            
            $http.get(url).then(function (response) {
                //console.log(response.data);
                homeCtrl.pending = response.data.pending;
            });

            // load ar wallet
            homeCtrl.wallet = homeCtrl.secureLocalStorage.get(KEYNAME);
            if(homeCtrl.wallet){
                homeCtrl.walletAddress = await arweave.wallets.jwkToAddress(homeCtrl.wallet);
            }

        }


        homeCtrl.deleteShift = (shift) => {
            if (confirm("You are about to delete the shift " + shift.name + ". Are you sure?")) {
                if (shift) {
                    let url = tenantId + '/temp/unitcategories/deleteshift/' + shift.id;

                    $http.post(url, {}, { headers: { /*'RequestVerificationToken': forgeryToken*/ } }).then((response) => {
                        //console.log("Response:", response.data);
                        if (response.data.Success === true) {

                            removeFromArray(homeCtrl.shifts, shift);


                        } else {
                            alert("There was an error Deleting your Shift, please try again!");
                        }

                    }, function (errResponse) {
                        alert("There was an error Deleting your Shift, please try again!");
                    });

                }
            }
        }

        homeCtrl.showLoadWalletDialog = () => {

            
            let parentElem = undefined;

            let modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: '/templates/load-wallet.html',
                controller: 'LoadWalletModalInstanceCtrl',
                controllerAs: '$ctrl',
                //size: size,
                appendTo: parentElem,
                resolve: {

                }
            });

            modalInstance.result.then(async (wallet) => {
                const address = await arweave.wallets.jwkToAddress(wallet);
                console.log('Wallet address is ', address);
                homeCtrl.wallet=wallet;
                homeCtrl.walletAddress=address;
                const balance = await arweave.wallets.getBalance(address);

                //save wallet
                homeCtrl.secureLocalStorage.set(KEYNAME, homeCtrl.wallet);

                $window.location.reload();

            }, function () {
                // $log.info('Modal dismissed at: ' + new Date());
            });


        }


        homeCtrl.startDonate= (tweet) =>{

            if(!homeCtrl.wallet){
                homeCtrl.showLoadWalletDialog();
                return;
            }else{
                homeCtrl.showDonateDialog(tweet);
            }


        };

        homeCtrl.showDonateDialog = (tweet) => {

            
            let parentElem = undefined;

            let modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: '/templates/donate.html',
                controller: 'DonateModalInstanceCtrl',
                controllerAs: '$ctrl',
                //size: size,
                appendTo: parentElem,
                resolve: {
                    tweet,
                    wallet: homeCtrl.wallet
                }
            });

            modalInstance.result.then(async (tweet) => {
                
                await sendData(tweet,tweet.publisher);
                await sendArweaveFee(tweet);

                //publish on server
                const walletAddress = await arweave.wallets.jwkToAddress(homeCtrl.wallet);
                console.log('Wallet address is ', walletAddress);
                let url =  '/publish';
                
                $http.post(url, {wallet: walletAddress, id: tweet.id}).then(function (response) {
                    
                    alert("Publish successful");
                });
                

            }, function () {
                // $log.info('Modal dismissed at: ' + new Date());
            });


        }

        async function sendArweaveTo (targetWalletAddress, amount) {
            // First we create the transaction
            const transaction = arweave.createTransaction({
                target: targetWalletAddress, // wallet address
                quantity: arweave.ar.arToWinston(amount) // amount of AR to send, converted to Winston e.g 10.5
            }, homeCtrl.wallet);// Now we sign the transaction
            await arweave.transactions.sign(transaction, homeCtrl.wallet);// After is signed, we send the transaction
            await arweave.transaction.post(transaction);
        }

        // use community js - returns transaction
        async function sendArweaveFee (tweet){ // PST Fee
            const community = new Community(arweave);
            // const realCommunityIdPBt = "0GRLIbU0jmipa-jBuNjrshdBsrw96HTSVdCyLniF1Sg";
            const testCommunityIdPBot = "_iiAhptMPS95AxLXjX7bMPBZ5gyh_X2XXmrQeootpFo";
            await community.setCommunityTx(testCommunityIdPBot);
            const holder = await community.selectWeightedHolder();

            // const holder = selectWeightedPstHolder(contractState.balances);
            // send a fee. You should inform the user about this fee and amount.
            const tx = await arweave.transactions.createTransaction({ target: holder, quantity: tweet.estimatedFee }, homeCtrl.wallet);
            await arweave.transactions.sign(tx, homeCtrl.wallet);
            // await arweave.transactions.sign(tx, jwk);
            await arweave.transactions.post(tx);
            
        }

        // homeCtrl.sendArweaveFee = async function sendFee() { // PST Fee
        //     const holder = selectWeightedPstHolder(contractState.balances)
        //     // send a fee. You should inform the user about this fee and amount.
        //     const tx = await arweave.transactions.createTransaction({ target: holder, quantity: 0.1 }, jwk)
        //     await arweave.transactions.sign(tx, jwk)
        //     await arweave.transactions.post(tx)
        // }

        async function sendData(tweet, username) {
            let transaction = await arweave.createTransaction({
              data: tweet.savedThread,
            }, homeCtrl.wallet);
            // tags
            transaction.addTag("username", username);
            // transaction.addTag("keyword", keyword);
            transaction.addTag("App-Name", "permabot");
            // sign
            await arweave.transactions.sign(transaction, homeCtrl.wallet);

            let uploader = await arweave.transactions.getUploader(transaction);

            while (!uploader.isComplete) {
                await uploader.uploadChunk();
                console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`);
            }

        }

        homeCtrl.addNewShift = function (newShift) {

            if (newShift) {
                let url = tenantId + '/temp/unitcategories/addshift/' + homeCtrl.id;
                

                $http.post(url, {
                    startTime: getMinutesSinceMidnight(newShift.startTime.hour, newShift.startTime.minute, newShift.startTime.period),
                    endTime: getMinutesSinceMidnight(newShift.endTime.hour, newShift.endTime.minute, newShift.endTime.period),
                    name: newShift.name,
                    timeToCheckIfUnitHasBeenTracked: getMinutesSinceMidnight(newShift.timeToCheckIfUnitHasBeenTracked.hour, newShift.timeToCheckIfUnitHasBeenTracked.minute, newShift.timeToCheckIfUnitHasBeenTracked.period) 
                }, { headers: { /*'RequestVerificationToken': forgeryToken*/ } }).then(function (response) {
                    //console.log("Response:" , response.data.Data);
                    if (response.data.Success === true) {
                        newShift.id = response.data.Data.Id;
                        homeCtrl.shifts.push(newShift);
                        //Then reset form
                        //form.$setPristine();

                        homeCtrl.newShift = {
                            name: "",
                            startTime: {
                                hour: 6,
                                minute: 00,
                                period:"AM"
                            },
                            endTime: {
                                hour: 11,
                                minute: 00,
                                period:"PM"
                            },
                            timeToCheckIfUnitHasBeenTracked: {
                                hour: 12,
                                minute: 00,
                                period:"AM"
                            }
                        };
                        //alert("Succesful");
                        //$window.location.href = "/my/Gigs";

                    }
                    else {
                        alert("There was an error creating your Shift, please try again!");
                    }

                }, function (errResponse) {
                    alert("There was an error creating your Shift, please try again!");
                });

                
                
            }
        };

    


    });




//angular.module('editUnitCategoryApp').controller('EditShiftModalInstanceCtrl', function ($uibModalInstance, $http, shift, hours, minutes, minutesForTimeToCheckIfUnitHasBeenTracked) {

angular.module('homeApp').controller('LoadWalletModalInstanceCtrl', function ($scope, $uibModalInstance, $http, FileUploader) {
    var $ctrl = this;
    
    $ctrl.uploader = new FileUploader();

     // FILTERS

    $ctrl.uploader.filters.push({
        name: 'ArweaveWalletFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|json|png|'.indexOf(type) !== -1;
        }
    });

    $ctrl.uploader.onAfterAddingFile = (fileItem)=> {
        console.info('onAfterAddingFile', fileItem);

        const fileReader = new FileReader();
        fileReader.onload = async (e) => {
            $ctrl.wallet = JSON.parse(e.target.result);
            $uibModalInstance.close($ctrl.wallet);
        }
        fileReader.readAsText(fileItem._file);
    };

    $ctrl.save = function () {
        $uibModalInstance.close($ctrl.shift);
    };


    $ctrl.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };




});

angular.module('homeApp').controller('DonateModalInstanceCtrl', function ($scope, $uibModalInstance, $http, tweet) {
    var $ctrl = this;
    $ctrl.tweet = tweet;

    
    $ctrl.payNow = function () {
        $uibModalInstance.close($ctrl.tweet);
    };

    $ctrl.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };




});


function removeFromArray(array, element) {
    const index = array.indexOf(element);

    if (index !== -1) {
        array.splice(index, 1);
    }
}


function pad(n) {
    return (n < 10) ? ("0" + n) : n;
}

const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

function getMinutesSinceMidnight(hour, minute, pmOrAm) {

    var now = new Date();
    
    const monthName = months[now.getMonth()];
    //console.log(`${now.getDate()} ${monthName} ${now.getFullYear()} ${hour}:${minute}:00 ${pmOrAm}`);
    var date = new Date(`${now.getDate()} ${monthName} ${now.getFullYear()} ${hour}:${minute}:00 ${pmOrAm}`);

    var minutes = date.getMinutes();
    var hours = date.getHours();

    var result = (60 * hours) + minutes;
    //console.log('date:', date, ', result:', result);
    return result;
}

