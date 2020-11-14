export default {
    eq: (arg1: any, arg2: any) => arg1 === arg2,

    formatDate: (dateTime: Date) => {
      const now = new Date();
      const secondsAgo = Math.round((now.getTime() - dateTime.getTime()) / 1000);
      const minutesAgo = secondsAgo > 60 ? Math.round(secondsAgo / 60) + " minutes ago" : null;
      const hoursAgo = secondsAgo > 3600 ? Math.round(secondsAgo / 3600) + " hours ago" : null;
      const daysAgo = secondsAgo > 86400 ? Math.round(secondsAgo / 86400) + " days ago" : null;
      return `${dateTime.toString().slice(4, 15)}<br>${dateTime.toString().slice(16, 24)}<br>${daysAgo || hoursAgo || minutesAgo || (secondsAgo + " seconds ago")}`;
    },
    // tslint:disable-next-line:object-literal-sort-keys
    formatAmount: (amount: number): string => {
      return amount.toFixed(7).replace(/\.?0+$/, "");
    },
    section(name: any, options: any): any {
      if (!this._sections) { this._sections = {}; }
      this._sections[name] = options.fn(this);
      return null;
    },
    rawhelper: function(options: any): any {
        return options.fn(this);
    }
  };
