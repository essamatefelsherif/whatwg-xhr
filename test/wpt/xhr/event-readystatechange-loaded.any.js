import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	let xhr  = new XMLHttpRequest();
	let countedLoading = 0;

	xhr.onreadystatechange = () => {
		if(xhr.readyState === 3){
			countedLoading += 1;
		}

		if(xhr.readyState === 4) {
			assert(countedLoading > 1, 'LOADING state change may be emitted multiple times');

			xhr.onreadystatechange = null;
		}
	};

	xhr.open('GET', `${activeURL}/trickle.py?count=10`);
	xhr.send();
}

/*
 * event-readystatechange-loaded.any.js
 *

// META: title=XMLHttpRequest: the LOADING state change may be emitted multiple times

var test = async_test();

test.step(function () {
    var client = new XMLHttpRequest();
    var countedLoading = 0;

    client.onreadystatechange = test.step_func(function () {
        if (client.readyState === 3) {
            countedLoading += 1;
        }

        if (client.readyState === 4) {
            assert_greater_than(countedLoading, 1, "LOADING state change may be emitted multiple times");

            test.done();
        }
    });

    client.open("GET", "resources/trickle.py?count=10"); // default timeout in trickle.py is 1/2 sec, so this request will take 5 seconds to complete
    client.send(null);
});

 *
 * event-readystatechange-loaded.any.js
 */
