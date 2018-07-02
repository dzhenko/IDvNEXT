using Humanizer;
using IDVN.Data.Models;
using MongoDB.Driver;

namespace IDVN.Data
{
    public class ApplicationData
    {
        private readonly IMongoDatabase db;

        public ApplicationData(IMongoDatabase db)
        {
            this.db = db;
        }

        public IMongoCollection<User> Users => this.db.GetCollection<User>(nameof(User).Pluralize());
    }
}
