import { subDays, subHours, subMinutes, subSeconds } from 'date-fns';

const now = new Date();

class CampaignApi {
  getCampaigns() {
    const campaigns = [
      {
        id: '5e887ac47eed253091be10cb',
        name: 'Compagne 1',
        campaignArn: 'Solution 1',
        creationDateTime: "2021-10-04",
        FailureReason: 'Canceled',
        lastUpdateDateTime: "2021-10-05",
        status: "CREATE PENDING"
        
      },
      {
        id: '5e887ac47eed253091be10cb',
        name: 'Compagne 2',
        campaignArn: 'Solution 2',
        creationDateTime: "2021-10-04",
        FailureReason: 'Canceled',
        lastUpdateDateTime: "2021-10-05",
        status: "CREATE PENDING"
        
      },
      {
        id: '5e887ac47eed253091be10cb',
        name: 'Compagne 3',
        campaignArn: 'Solution 3',
        creationDateTime: "2021-10-04",
        FailureReason: 'Canceled',
        lastUpdateDateTime: "2021-10-05",
        status: "CREATE PENDING"
        
      },
      {
        id: '5e887ac47eed253091be10cb',
        name: 'Compagne 4',
        campaignArn: 'Solution 4',
        creationDateTime: "2021-10-04",
        FailureReason: 'Canceled',
        lastUpdateDateTime: "2021-10-05",
        status: "CREATE PENDING"
        
      },
      {
        id: '5e887ac47eed253091be10cb',
        name: 'Compagne 5',
        campaignArn: 'Solution 5',
        creationDateTime: "2021-10-04",
        FailureReason: 'Canceled',
        lastUpdateDateTime: "2021-10-05",
        status: "CREATE PENDING"
        
      },
      {
        id: '5e887ac47eed253091be10cb',
        name: 'Compagne 6',
        campaignArn: 'Solution 6',
        creationDateTime: "2021-10-04",
        FailureReason: 'Canceled',
        lastUpdateDateTime: "2021-10-05",
        status: "CREATE PENDING"
        
      },
      {
        id: '5e887ac47eed253091be10cb',
        name: 'Compagne 7',
        campaignArn: 'Solution 7',
        creationDateTime: "2021-10-04",
        FailureReason: 'Canceled',
        lastUpdateDateTime: "2021-10-05",
        status: "CREATE PENDING"
        
      },
      {
        id: '5e887ac47eed253091be10cb',
        name: 'Compagne 8',
        campaignArn: 'Solution 8',
        creationDateTime: "2021-10-04",
        FailureReason: 'Canceled',
        lastUpdateDateTime: "2021-10-05",
        status: "CREATE PENDING"
        
      },
    ];

    return Promise.resolve(campaigns);
  }

  getCustomerLogs() {
    const logs = [
      {
        id: '5ece2cfeb6e2ac847bba11ce',
        createdAt: subDays(subMinutes(subSeconds(now, 56), 2), 2).getTime(),
        description: 'Purchase',
        ip: '84.234.243.42',
        method: 'POST',
        route: '/__fakeApi__/purchase',
        status: 200
      },
      {
        id: '5ece2d02510484b2952e1e05',
        createdAt: subDays(subMinutes(subSeconds(now, 56), 2), 2).getTime(),
        description: 'Purchase',
        ip: '84.234.243.42',
        method: 'POST',
        route: '/__fakeApi__/purchase',
        status: 522
      },
      {
        id: '5ece2d08e2748e4e9788901a',
        createdAt: subDays(subMinutes(subSeconds(now, 23), 8), 2).getTime(),
        description: 'Cart remove',
        ip: '84.234.243.42',
        method: 'DELETE',
        route: '/__fakeApi__/products/d65654e/remove',
        status: 200
      },
      {
        id: '5ece2d0c47214e342c2d7f28',
        createdAt: subDays(subMinutes(subSeconds(now, 54), 20), 2).getTime(),
        description: 'Cart add',
        ip: '84.234.243.42',
        method: 'GET',
        route: '/__fakeApi__/products/d65654e/add',
        status: 200
      },
      {
        id: '5ece2d11e4060a97b2b57623',
        createdAt: subDays(subMinutes(subSeconds(now, 16), 34), 2).getTime(),
        description: 'Cart add',
        ip: '84.234.243.42',
        method: 'GET',
        route: '/__fakeApi__/products/c85727f/add',
        status: 200
      },
      {
        id: '5ece2d16cf6d53d8e33656af',
        createdAt: subDays(subMinutes(subSeconds(now, 30), 54), 2).getTime(),
        description: 'View product',
        ip: '84.234.243.42',
        method: 'GET',
        route: '/__fakeApi__/products/c85727f',
        status: 200
      },
      {
        id: '5ece2d1b2ec5071be9286a96',
        createdAt: subDays(subMinutes(subSeconds(now, 40), 56), 2).getTime(),
        description: 'Get products',
        ip: '84.234.243.42',
        method: 'GET',
        route: '/__fakeApi__/products',
        status: 200
      },
      {
        id: '5ece2d22e68d5498917e47bc',
        createdAt: subDays(subMinutes(subSeconds(now, 5), 57), 2).getTime(),
        description: 'Login',
        ip: '84.234.243.42',
        method: 'POST',
        route: '/__fakeApi__/authentication/login',
        status: 200
      }
    ];

    return Promise.resolve(logs);
  }

  getCampaign() {
    const campaign = {
        id: '5e887ac47eed253091be10cb',
        name: 'Compagne 1',
        campaignArn: 'Solution 1',
        minProvisionedTps: 1,
        creationDateTime: "2021-10-04",
        FailureReason: 'Canceled',
        lastUpdateDateTime: "2021-10-05",
        status: "CREATE PENDING" 
      };
       return Promise.resolve(campaign);
    }
}
export const campaignApi = new CampaignApi();
