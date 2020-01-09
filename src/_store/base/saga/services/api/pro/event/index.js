import _error from './error';
import _register from './register';
import _account from './account';
import _recharge from './recharge';
import _info from './info';
import _notice from './notice';
import _cs from './cs';
import _trade from './trade';
import _quote from './quote';
import _position from './position';
import _bank from './bank'
import _game from './game';
import _password from './password';
import _live from './live';

import {develop} from "../../lib/trace";
import {STORE} from "../../core/store/state";

develop(_account);
develop(_trade);

export const EVENT = {
    Error:_error,
    Register:_register,
    Account:_account,
    Recharge:_recharge,
    Info:_info,
    Notice:_notice,
    Cs:_cs,
    Trade:STORE.empower(_trade,'initial',STORE.STATE.TRADE),
    Quote:_quote,
    Position:_position,
    Game:_game,
    Bank:_bank,
    Password:_password,
    Live:_live
};