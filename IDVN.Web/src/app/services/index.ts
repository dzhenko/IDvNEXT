import { AppService } from './core/app.service';
import { ConfigService } from './core/config.service';
import { DateTimeService } from './core/datetime.service';
import { GridService } from './core/grid.service';
import { HttpService } from './core/http.service';
//import { IdentityService } from './core/identity.service';
import { LoaderService } from './core/loader.service';
import { LoggerService } from './core/logger.service';
import { NotificationsService } from './core/notifications.service';
import { RouterService } from './core/router.service';
import { StorageService } from './core/storage.service';
import { UtilsService } from './core/utils.service';

import { AliasesDataService } from './data/aliases.data.service';
import { IPFSDataService } from './data/ipfs.data.service';

import { AliasesContractService } from './eth/aliases.contract.service';
import { AliasesContract } from './eth/aliases.contract';
import { EthService } from './eth/eth.service';
import { IPFSClientService } from './eth/ipfs.client.service';
import { IPFSService } from './eth/ipfs.service';
import { MetamaskService } from './eth/metamask.service';
import { TokenContractService } from './eth/token.contract.service';
import { Web3Service } from './eth/web3.service';

export * from './core/app.service';
export * from './core/config.service';
export * from './core/datetime.service';
export * from './core/grid.service';
export * from './core/http.service';
//export * from './core/identity.service';
export * from './core/loader.service';
export * from './core/logger.service';
export * from './core/notifications.service';
export * from './core/router.service';
export * from './core/storage.service';
export * from './core/utils.service';

export * from './data/aliases.data.service';
// export * from './data/ipfs.data.service';

export * from './eth/aliases.contract.service';
export * from './eth/aliases.contract';
export * from './eth/eth.service';
// export * from './eth/ipfs.client.service';
export * from './eth/ipfs.service';
export * from './eth/metamask.service';
export * from './eth/token.contract.service';
export * from './eth/web3.service';

export const APP_SERVICES = [
    AppService,
    ConfigService,
    DateTimeService,
    GridService,
    HttpService,
    //IdentityService,
    LoaderService,
    LoggerService,
    NotificationsService,
    RouterService,
    StorageService,
    UtilsService,

    AliasesDataService,
    IPFSDataService,

    AliasesContractService,
    AliasesContract,
    EthService,
    IPFSService,
    IPFSClientService,
    MetamaskService,
    TokenContractService,
    Web3Service
];
