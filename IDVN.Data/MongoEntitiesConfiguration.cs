using Humanizer;
using IDVN.Data.Attributes;
using IDVN.Data.Models;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace IDVN.Data
{
    public class MongoEntitiesConfiguration
    {
        public static void Configure(IMongoDatabase db)
        {
            if (db == null)
            {
                throw new ArgumentNullException(nameof(db));
            }

            // TODO: Register class maps

            ConfigureIndexes(db);
        }

        private static void ConfigureIndexes(IMongoDatabase db)
        {
            var indexedProps = GetIndexedProps();

            if (!indexedProps.Any())
            {
                return;
            }

            var collectionNames = db.ListCollections().ToList().Select(c => c["name"].AsString);
            foreach (var collectionName in collectionNames)
            {
                foreach (var kv in indexedProps)
                {
                    if (collectionName.StartsWith(kv.Key + "_") || collectionName == kv.Key)
                    {
                        ApplyIndex(db, collectionName, kv.Value);

                        break;
                    }
                }
            }
        }

        private static void ApplyIndex(
            IMongoDatabase db,
            string collectionName,
            IDictionary<string, Tuple<MongoIndexType, bool>> propIndexMappings)
        {
            var collection = db.GetCollection<object>(collectionName);

            foreach (var kv in propIndexMappings)
            {
                var builder = Builders<object>.IndexKeys;

                switch (kv.Value.Item1)
                {
                    case MongoIndexType.Ascending:
                        collection.Indexes.CreateOne(new CreateIndexModel<object>(
                            builder.Ascending(kv.Key),
                            new CreateIndexOptions { Unique = kv.Value.Item2 }));
                        break;
                    case MongoIndexType.Descending:
                        collection.Indexes.CreateOne(new CreateIndexModel<object>(
                            builder.Descending(kv.Key),
                            new CreateIndexOptions { Unique = kv.Value.Item2 }));
                        break;
                    default:
                        throw new ArgumentOutOfRangeException(nameof(propIndexMappings));
                }
            }
        }

        private static IDictionary<string, IDictionary<string, Tuple<MongoIndexType, bool>>> GetIndexedProps()
        {
            var baseMongoEntityType = typeof(BaseEntity);
            var types = baseMongoEntityType.Assembly
                .GetExportedTypes()
                .Where(t => baseMongoEntityType.IsAssignableFrom(t) && !t.IsAbstract);

            var result = new Dictionary<string, IDictionary<string, Tuple<MongoIndexType, bool>>>();

            foreach (var type in types)
            {
                var indexedProps = type
                    .GetProperties(BindingFlags.Public | BindingFlags.Instance)
                    .Select(p => p.GetCustomAttribute<MongoIndexAttribute>())
                    .Where(a => a != null)
                    .ToList();

                if (indexedProps.Any())
                {
                    var propNameMongoIndexTypeMappings = indexedProps.ToDictionary(
                        p => p.PropertyName,
                        p => new Tuple<MongoIndexType, bool>(p.Type, p.IsUnique));
                    var namePrefix = type.Name.Pluralize(inputIsKnownToBeSingular: false);

                    result.Add(namePrefix, propNameMongoIndexTypeMappings);
                }
            }

            return result;
        }
    }
}
