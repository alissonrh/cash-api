const express = require('express');
const peopleDB = require('../db/peopleDB');
const transactionDB = require('../db/transactionsDB');
const logDB = require('../db/logsDB');

const router = express.Router();

router.post('/', async (req, res) => {
  console.log('BODY', req.body);
  const person = req.body;
  try {
    const [result] = await peopleDB.insertEEE(person);
    console.log('[result]', result);
    res.status(201).json({
      message: `Pessoa cadastrada com sucesso com o id ${result.insertId}`,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: `Ocorreu um erro ao cadastrar uma pessoa: ${err.sqlMessage}` });
  }
});

router.get('/', async (_req, res) => {
  try {
    const [result] = await peopleDB.findAll();
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.sqlMessage });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [[result]] = await peopleDB.findById(id);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: 'Pessoa não encontrada' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.sqlMessage });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const person = req.body;
    const [result] = await peopleDB.update(person, id);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: `Pessoa de id ${id} atualizada com sucesso` });
    } else {
      res.status(404).json({ message: 'Pessoa não encontrada' });
    }
  } catch (err) {
    res.status(500).json({ message: err.sqlMessage });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await peopleDB.remove(id);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: `Pessoa de id ${id} excluída com sucesso` });
    } else {
      res.status(404).json({ message: 'Pessoa não encontrada' });
    }
  } catch (err) {
    res.status(500).json({ message: err.sqlMessage });
  }
});

router.post('/:personId/transactions', async (req, res) => {
  const { personId } = req.params;
  const transaction = req.body;

  try {
    const log = {
      event: `Pessoa com id ${personId} inseriu transação ${transaction.name}`,
      timestamp: new Date(),
    };
    await logDB.insert(log, personId);
    const [result] = await transactionDB.insert(transaction, personId);
    res.status(201).json(
      { message: `Transação cadastrada com sucesso com o id ${result.insertId}` },
);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: `Ocorreu um erro: ${e.message}` });
  }
});

module.exports = router;