import { $ } from '@wdio/globals';
import Page from './page.js';

class SecurePage extends Page {
    // success / info banner on /secure
    get flashAlert () {
        return $('#flash');
    }

    // logout <a> link:
    // <a class="button secondary radius btn btn-danger" href="/logout">...</a>
    get logoutButton () {
        return $('a[href="/logout"]');
    }

    open () {
        return super.open('/secure');
    }
}

export default new SecurePage();