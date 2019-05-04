import {asyncHandler} from '../lib/server/asyncExpressHandler';
import chai from 'chai';
import chaiHttp from 'chai-http';
import * as assert from 'assert';

require('source-map-support').install();

import express = require('express');

chai.use(chaiHttp);

// TODO: complete

describe('asyncHandler', () => {

    it('should return value on promise resolved', function(done: any) {

        const app = express();
        app.post('/', asyncHandler((req, res) => Promise.resolve({value: 'Hey'})));

        chai.request(app)
            .post('/')
            .end((err, res) => {
                assert.deepStrictEqual(res.status, 200);
                assert.deepStrictEqual(res.text, '{"value":"Hey"}');
                done();
            });
    });

    it('should return error on promise rejected', function(done: any) {

        const app = express();
        app.post('/', asyncHandler((req, res) => Promise.reject(new Error('Error'))));

        chai.request(app)
            .post('/')
            .end((err, res) => {
                assert.deepStrictEqual(res.status, 500);
                done();
            });
    });

    it('should return error on exception thrown', function(done: any) {

        const app = express();
        app.post('/', asyncHandler((req, res) => {
            throw new Error('Error');
        }));

        chai.request(app)
            .post('/')
            .end((err, res) => {
                assert.deepStrictEqual(res.status, 500);
                done();
            });
    });

    it('should return error on async rejected', function(done: any) {

        const app = express();
        app.post('/', asyncHandler(async (req, res) => {
            await Promise.reject();
        }));

        chai.request(app)
            .post('/')
            .end((err, res) => {
                assert.deepStrictEqual(res.status, 500);
                done();
            });
    });

    it('should return error on promise rejected', function(done: any) {

        const app = express();
        app.post('/', asyncHandler(async (req, res) => {
            return new Error('Test error');
        }));

        chai.request(app)
            .post('/')
            .end((err, res) => {
                assert.deepStrictEqual(res.status, 500);
                done();
            });
    });

});
