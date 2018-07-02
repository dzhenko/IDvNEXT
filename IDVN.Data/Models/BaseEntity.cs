namespace IDVN.Data.Models
{
    using System;
    using IDVN.Data.Attributes;
    using MongoDB.Bson;
    using MongoDB.Bson.Serialization.Attributes;

    public abstract class BaseEntity
    {
        protected BaseEntity()
        {
            this.Id = ObjectId.GenerateNewId().ToString();
            this.CreatedOn = DateTime.UtcNow;
        }

        [BsonId]
        public string Id { get; set; }

        [BsonElement("c")]
        [MongoIndex("c", Type = MongoIndexType.Descending)]
        public DateTime CreatedOn { get; set; }
    }
}
