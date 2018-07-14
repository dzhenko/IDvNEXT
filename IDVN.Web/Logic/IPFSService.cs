using Ipfs;
using System;
using System.IO;
using System.Threading.Tasks;

namespace IDVN.Web.Logic
{
    public class IPFSService : IDisposable
    {
        private readonly IpfsClient ipfs;

        public IPFSService()
        {
            this.ipfs = new IpfsClient();
        }

        public async Task<string> AddFile(string fileName, Stream fileStream)
        {
            if (string.IsNullOrEmpty(fileName))
            {
                return null;
            }

            if (fileStream == null)
            {
                return null;
            }

            using (var inputStream = new IpfsStream(fileName, fileStream))
            {
                var node = await ipfs.Add(inputStream);
                return node.ToString();
            }
        }

        public async Task<Stream> ReadFile(string hash)
        {
            if (string.IsNullOrEmpty(hash))
            {
                return null;
            }

            return await ipfs.Cat(hash);
        }

        public void Dispose()
        {
            using (var ipfs = new IpfsClient())
            {
                var peers = ipfs.Swarm.Peers().GetAwaiter().GetResult();
                ipfs.Swarm.Disconnect(peers).Wait();
            }
        }
    }
}
