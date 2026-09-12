import type { IncomingMessage, ServerResponse } from 'http';
import { store } from '../data/store';
import { UserAccount, Medicine, Pharmacy, CustomerOrder, B2BOrder, Complaint } from '../unifiedTypes';

/**
 * Parses URL query parameters from incoming request URL
 */
function parseQueryParams(urlStr: string): Record<string, string> {
  const url = new URL(urlStr, 'http://localhost');
  const params: Record<string, string> = {};
  url.searchParams.forEach((val, key) => {
    params[key] = val;
  });
  return params;
}

/**
 * Sends a standardized JSON response
 */
function sendJson(res: ServerResponse, statusCode: number, data: any) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.end(JSON.stringify(data));
}

/**
 * Reads request body as JSON
 */
async function readJsonBody<T = any>(req: IncomingMessage): Promise<T> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      if (!body) {
        resolve({} as T);
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', (err) => reject(err));
  });
}

export function createApiMiddleware() {
  return async (req: IncomingMessage, res: ServerResponse, next: (err?: any) => void) => {
    // Handle CORS Preflight
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.statusCode = 204;
      res.end();
      return;
    }

    const url = req.url || '/';
    const method = req.method || 'GET';
    const path = url.split('?')[0];
    const query = parseQueryParams(url);

    try {
      // ---------------------------------------------------------
      // AUTH
      // ---------------------------------------------------------
      if (path === '/api/v1/auth/login' && method === 'POST') {
        const body = await readJsonBody(req);
        const user = store.getUsers().find(u => u.email === body.email);
        if (user) {
          return sendJson(res, 200, { user, token: 'simulated-jwt-token' });
        }
        return sendJson(res, 401, { error: 'Invalid credentials' });
      }

      // ---------------------------------------------------------
      // MEDICINES (Global Catalog)
      // ---------------------------------------------------------
      if (path === '/api/v1/medicines' && method === 'GET') {
        return sendJson(res, 200, { medicines: store.getMedicines() });
      }

      if (path === '/api/v1/medicines' && method === 'POST') {
        const body = await readJsonBody<Medicine>(req);
        body.id = `med-${Date.now()}`;
        store.getMedicines().push(body);
        return sendJson(res, 201, { medicine: body });
      }

      // ---------------------------------------------------------
      // PHARMACIES & INVENTORY
      // ---------------------------------------------------------
      if (path === '/api/v1/pharmacies' && method === 'GET') {
        return sendJson(res, 200, { pharmacies: store.getPharmacies() });
      }

      if (path === '/api/v1/inventory' && method === 'GET') {
        return sendJson(res, 200, { inventory: store.getInventory() });
      }

      // ---------------------------------------------------------
      // ORDERS
      // ---------------------------------------------------------
      if (path === '/api/v1/orders' && method === 'GET') {
        return sendJson(res, 200, { orders: store.getCustomerOrders() });
      }

      if (path === '/api/v1/orders' && method === 'POST') {
        const body = await readJsonBody<CustomerOrder>(req);
        body.id = `ord-${Date.now()}`;
        body.status = 'PLACED';
        body.createdAt = new Date().toISOString();
        body.updatedAt = body.createdAt;
        store.getCustomerOrders().push(body);
        return sendJson(res, 201, { order: body });
      }

      // ---------------------------------------------------------
      // COMPLAINTS
      // ---------------------------------------------------------
      if (path === '/api/v1/complaints' && method === 'GET') {
        return sendJson(res, 200, { complaints: store.getComplaints() });
      }

      if (path === '/api/v1/complaints' && method === 'POST') {
        const body = await readJsonBody<Complaint>(req);
        body.id = `cmp-${Date.now()}`;
        body.createdAt = new Date().toISOString();
        body.status = 'OPEN';
        store.getComplaints().push(body);
        return sendJson(res, 201, { complaint: body });
      }

      // Pass down to the next handler if not matched
      next();
    } catch (error) {
      console.error('API Error:', error);
      sendJson(res, 500, { error: 'Internal Server Error' });
    }
  };
}
