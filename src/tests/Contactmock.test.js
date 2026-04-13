const { getAll, getSingle } = require('../controllers/contacts');
const User = require('../models/contact');

jest.mock('../models/contact');

describe('Contact controller: getAll', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      setHeader: jest.fn(),
    };
  });

  it('should return 200 and a list of contacts', async () => {
    const mockUsers = [
      {
        firstName: 'Sione',
        lastName: 'Uhlig',
        email: 'sione@example.com',
        membershipType: 'standard',
        phone: '555-0101',
        joinDate: '2024-01-15',
        birthday: '1993-04-17',
      },
      {
        firstName: 'Jane',
        lastName: 'Walz',
        email: 'jane@example.com',
        membershipType: 'premium',
        phone: '555-0102',
        joinDate: '2023-09-02',
        birthday: '2001-09-02',
      },
    ];
    User.getAllUsers.mockResolvedValue(mockUsers);

    await getAll(req, res);

    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUsers);
  });

  it('should return 200 with an empty array when no contacts exist', async () => {
    User.getAllUsers.mockResolvedValue([]);

    await getAll(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([]);
  });

  it('should return 500 if DB connection fails', async () => {
    User.getAllUsers.mockRejectedValue(new Error('Error retrieving library users.'));

    await getAll(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe('Contact controller: getSingle', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = { params: { id: '69ace9e361d3f1ef010f59c0' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      setHeader: jest.fn(),
    };
  });

  it('should return 200 and the contact when ID exists', async () => {
    const mockUser = {
      firstName: 'Sione',
      lastName: 'Uhlig',
      email: 'sione@example.com',
      membershipType: 'standard',
      phone: '555-0101',
      joinDate: '2024-01-15',
      birthday: '1993-04-17',
    };
    User.getUserById.mockResolvedValue(mockUser);

    await getSingle(req, res);

    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUser);
    expect(User.getUserById).toHaveBeenCalledWith('69ace9e361d3f1ef010f59c0');
  });

  it('should return 404 when contact is not found', async () => {
    User.getUserById.mockResolvedValue(null);

    await getSingle(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Library user not found.' });
  });

  it('should return 500 when DB throws an error', async () => {
    User.getUserById.mockRejectedValue(new Error('DB connection error'));

    await getSingle(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});