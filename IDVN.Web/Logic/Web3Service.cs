using Microsoft.Extensions.Configuration;
using Nethereum.Contracts;
using Nethereum.Web3;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IDVN.Web.Logic
{
    public class Web3Service
    {
        private readonly Web3 web3;

        public Web3Service(IConfiguration configuration)
        {
            this.web3 = new Web3(configuration["Web3NodeUrl"]);
        }

        public Contract GetContract(string contractAbi, string contractAddress)
            => this.web3.Eth.GetContract(contractAbi, contractAddress);
    }
}
