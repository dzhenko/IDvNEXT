using Microsoft.Extensions.Configuration;
using Nethereum.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IDVN.Web.Logic
{
    public class AliasesService
    {
        private const string EmptyAddress = "0x0000000000000000000000000000000000000000";

        private readonly Contract contract;

        private static int ResolvedAliasesCount = 0;
        private static int QuriesCount = 0;

        public AliasesService(IConfiguration configuration, Web3Service web3Service)
        {
            this.contract = web3Service.GetContract(configuration["AliasesContractABI"], configuration["AliasesContractAddress"]);
        }

        public async Task<string> AliasToAddress(string alias)
        {
            QuriesCount++;

            var address = await this.contract.GetFunction("aliasToAddress").CallAsync<string>(alias);

            if (string.IsNullOrEmpty(address) || string.Equals(address, EmptyAddress, StringComparison.OrdinalIgnoreCase))
            {
                return null;
            }

            ResolvedAliasesCount++;
            return address;
        }

        public int GetQueriesCount()
            => QuriesCount;

        public int GetResolvedAliasesCount()
            => ResolvedAliasesCount;
    }
}
