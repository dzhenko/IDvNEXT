namespace IDVN.Data.Attributes
{
    using System;
    using System.Runtime.CompilerServices;

    [AttributeUsage(AttributeTargets.Property, Inherited = true, AllowMultiple = false)]
    public class MongoIndexAttribute : Attribute
    {
        public MongoIndexAttribute([CallerMemberName]string propertyName = null)
        {
            this.PropertyName = propertyName;
        }

        public string PropertyName { get; }

        public MongoIndexType Type { get; set; }

        public bool IsUnique { get; set; }
    }
}
