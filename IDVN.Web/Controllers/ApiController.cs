using IDVN.Web.Logic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IDVN.Web.Controllers
{
    public class ApiController : Controller
    {
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> AliasToAddress(string id, [FromServices]AliasesService aliasesService)
            => this.Ok(await aliasesService.AliasToAddress(id));

        [HttpGet]
        public IActionResult GetQueriesCount([FromServices]AliasesService aliasesService)
            => this.Ok(aliasesService.GetQueriesCount());

        [HttpGet]
        public IActionResult GetResolvedAliasesCount([FromServices]AliasesService aliasesService)
            => this.Ok(aliasesService.GetResolvedAliasesCount());

        [HttpPost]
        public async Task<IActionResult> UpdateAvatarHash([FromServices]IPFSService iPFSService, [FromForm]UpdateAvatarBindingModel model)
        {            
            var hash = await iPFSService.AddFile(model?.Avatar?.FileName, model?.Avatar?.OpenReadStream());
            if (string.IsNullOrEmpty(hash))
            {
                return this.BadRequest();
            }

            return this.Ok(new { hash });
        }
    }

    public class UpdateAvatarBindingModel
    {
        public IFormFile Avatar { get; set; }
    }
}
