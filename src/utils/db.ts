import Dexie from 'dexie';
import { MenuItem } from '../data/menu';
import * as faceapi from 'face-api.js';

export class Database extends Dexie {
  users: Dexie.Table<{id: string, faceDescriptor: Float32Array}, string>;
  orders: Dexie.Table<{id: string, userId: string, items: MenuItem[]}, string>;

  constructor() {
    super('RestaurantDB');
    this.version(1).stores({
      users: 'id, faceDescriptor',
      orders: 'id, userId, items'
    });
  }

  async findUserByFace(newFaceDescriptor: Float32Array) {
    const users = await this.users.toArray();
    const threshold = 0.4; // Lower threshold means stricter matching

    for (const user of users) {
      const distance = faceapi.euclideanDistance(
        newFaceDescriptor,
        new Float32Array(Object.values(user.faceDescriptor))
      );
      if (distance < threshold) {
        return user;
      }
    }
    return null;
  }

  async addNewUser(faceDescriptor: Float32Array) {
    const id = crypto.randomUUID();
    await this.users.add({
      id,
      faceDescriptor
    });
    return id;
  }

  async getPreviousOrders(userId: string): Promise<MenuItem[]> {
    const lastOrder = await this.orders
      .where('userId')
      .equals(userId)
      .last();
    
    return lastOrder?.items || [];
  }

  async saveOrder(userId: string, items: MenuItem[]) {
    await this.orders.add({
      id: crypto.randomUUID(),
      userId,
      items
    });
  }
}