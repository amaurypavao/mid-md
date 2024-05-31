require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

app.use(express.json());

const VTEX_ACCOUNT_NAME = process.env.VTEX_ACCOUNT_NAME;
const VTEX_ENVIRONMENT = process.env.VTEX_ENVIRONMENT;
const VTEX_APP_KEY = process.env.VTEX_APP_KEY;
const VTEX_APP_TOKEN = process.env.VTEX_APP_TOKEN;

async function fetchMasterData(entity, documentId) {
  const url = `https://${VTEX_ACCOUNT_NAME}.${VTEX_ENVIRONMENT}.com.br/api/dataentities/${entity}/documents/${documentId}?_fields=_all`;
  const headers = {
    'Content-Type': 'application/json',
    'X-VTEX-API-AppKey': VTEX_APP_KEY,
    'X-VTEX-API-AppToken': VTEX_APP_TOKEN,
  };
  const response = await axios.get(url, { headers });
  return response.data;
}

async function updateMasterData(entity, documentId, updateData) {
  const url = `https://${VTEX_ACCOUNT_NAME}.${VTEX_ENVIRONMENT}.com.br/api/dataentities/${entity}/documents/${documentId}`;
  const headers = {
    'Content-Type': 'application/json',
    'X-VTEX-API-AppKey': VTEX_APP_KEY,
    'X-VTEX-API-AppToken': VTEX_APP_TOKEN,
  };
  const response = await axios.patch(url, updateData, { headers });
  return response.data;
}

app.get('/api/vtex-master-data', async (req, res) => {
  try {
    const { entity, documentId } = req.body;
    if (!entity || !documentId) {
      return res.status(400).send('Entity and Document ID are required');
    }
    const data = await fetchMasterData(entity, documentId);
    res.json(data);
  } catch (error) {
    console.error('Error fetching data from VTEX Master Data:', error);
    res.status(500).send('Error fetching data from VTEX Master Data');
  }
});

app.patch('/api/vtex-master-data', async (req, res) => {
  try {
    const { entity, documentId, updateData } = req.body;
    if (!entity || !documentId || !updateData) {
      return res.status(400).send('Entity, Document ID, and Update Data are required');
    }
    const updatedData = await updateMasterData(entity, documentId, updateData);
    res.json(updatedData);
  } catch (error) {
    console.error('Error updating data in VTEX Master Data:', error);
    res.status(500).send('Error updating data in VTEX Master Data');
  }
});

app.listen(port, () => {
  console.log(`VTEX middleware listening at http://localhost:${port}`);
});
