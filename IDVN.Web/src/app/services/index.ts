import { AppService } from './core/app.service';
import { ConfigService } from './core/config.service';
import { DateTimeService } from './core/datetime.service';
import { GridService } from './core/grid.service';
import { HttpService } from './core/http.service';
import { IdentityService } from './core/identity.service';
import { LoaderService } from './core/loader.service';
import { LoggerService } from './core/logger.service';
import { NotificationsService } from './core/notifications.service';
import { RouterService } from './core/router.service';
import { StorageService } from './core/storage.service';
import { UtilsService } from './core/utils.service';

import { AliasesContractService } from './eth/aliases.contract.service';
import { AliasesContract } from './eth/aliases.contract';
import { EthService } from './eth/eth.service';
import { MetamaskService } from './eth/metamask.service';
import { SwarmService } from './eth/swarm.service';
import { Web3Service } from './eth/web3.service';

export * from './core/app.service';
export * from './core/config.service';
export * from './core/datetime.service';
export * from './core/grid.service';
export * from './core/http.service';
export * from './core/identity.service';
export * from './core/loader.service';
export * from './core/logger.service';
export * from './core/notifications.service';
export * from './core/router.service';
export * from './core/storage.service';
export * from './core/utils.service';

export * from './eth/aliases.contract.service';
export * from './eth/aliases.contract';
export * from './eth/eth.service';
export * from './eth/metamask.service';
export * from './eth/swarm.service';
export * from './eth/web3.service';

export const APP_SERVICES = [
    AppService,
    ConfigService,
    DateTimeService,
    GridService,
    HttpService,
    IdentityService,
    LoaderService,
    LoggerService,
    NotificationsService,
    RouterService,
    StorageService,
    UtilsService,

    AliasesContractService,
    AliasesContract,
    EthService,
    MetamaskService,
    SwarmService,
    Web3Service
];
