const { findAll, findOne } = require('../controllers/authors');
const db = require('../models');
const Authors = db.authors;

jest.mock('../models');

describe('Author controller: findAll', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  it('should return 200 status and a list of authors', async () => {
    const mockData = [
      {
        firstName: 'Mary',
        lastName: 'Shelley',
        pseudonym: 'Mrs. Shelley',
        birthDate: '1797-08-30',
        deathDate: '1851-02-01',
      },
      {
        firstName: 'Samuel',
        lastName: 'Clemens',
        pseudonym: 'Mark Twain',
        birthDate: '1835-11-30',
        deathDate: '1910-04-21',
      },
      {
        firstName: 'John Ronald Reuel',
        lastName: 'Tolkien',
        pseudonym: 'J.R.R. Tolkien',
        birthDate: '1892-01-03',
        deathDate: '1973-09-02',
      },
    ];
    Authors.find.mockResolvedValue(mockData);

    await findAll(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(mockData);
  });

  it('should return status 500 if find all fails', async () => {
    Authors.find.mockRejectedValue(
      new Error('Some error occurred while retrieving authors.'),
    );

    await findAll(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe('Author controller: findOne', () => {
  let req, res;
  beforeEach(() => {
    jest.clearAllMocks();
    req = { params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  it('should return status 200 and one author by ID', async () => {
    const mockData = {
      firstName: 'Mary',
      lastName: 'Shelley',
      pseudonym: 'Mrs. Shelley',
    };
    req.params.author_id = '123';
    Authors.findById = jest.fn().mockResolvedValue(mockData);

    await findOne(req, res);

    expect(res.send).toHaveBeenCalledWith(mockData);
    expect(Authors.findById).toHaveBeenCalledWith('123');
  });

  it('should return status 400 if author not found', async () => {
    req.params.author_id = '999';
    Authors.findById = jest.fn().mockResolvedValue(null);

    await findOne(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Not found author with id: 999',
      }),
    );
  });
});
