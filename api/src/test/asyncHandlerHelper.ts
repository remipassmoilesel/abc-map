import {asyncHandler} from '../lib/server/asyncExpressHandler';
import chai from 'chai';
import chaiHttp from 'chai-http';
import * as assert from 'assert';

require('source-map-support').install();

import express = require('express');

chai.use(chaiHttp);

describe('asyncHandler', () => {

    it('should return value on promise resolved', function(done: any) {

        const app = express();
        app.post('/', asyncHandler((req, res) => Promise.resolve({value: 'Hey'})));

        chai.request(app)
            .post('/')
            .end((err, res) => {
                assert.deepStrictEqual(res.text, '{"value":"Hey"}');
                done();
            });
    });

});
