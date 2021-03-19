import { Services } from '../services/services';
import { AnonymousUser } from '@abc-map/shared-entities';
import { TestHelper } from './TestHelper';

export class TestAuthentication {
  constructor(private services: Services) {}

  public anonymous() {
    const token = this.services.authentication.signToken(AnonymousUser);
    return `Bearer ${token}`;
  }

  public connectedUser() {
    const user = TestHelper.sampleUser();
    const token = this.services.authentication.signToken(user);
    return `Bearer ${token}`;
  }
}
