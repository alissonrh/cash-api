const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');

const app = require('../../src/app');
const connection = require('../../src/db/connection');
const logsDB = require('../../src/db/logsDB');

const { expect, use } = chai;

use(chaiHttp);


describe('Endpoints `/people/:personId/transactions`', function () {

    afterEach(() => {
        sinon.restore();
    });

    it('POST - Insere transação com sucesso.', async function () {

        sinon.stub(connection, 'execute').resolves( [{ insertId: 42 }] );
        sinon.stub(logsDB, 'insert').resolves([]);

        const response = await chai
                                .request(app)
                                .post('/people/1/transactions')
                                .send({
                                    name: 'Sabre de Luz',
                                    description: 'Ferramenta de trabalho',
                                    price: '1000.00',
                                    type: 2,
                                  });
        
        expect(response.status).to.be.equal(201);
        expect(response.body).to.deep.equal({ message: 'Transação cadastrada com sucesso com o id 42' });
    })

})