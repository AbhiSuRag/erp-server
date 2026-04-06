//imports
const orgModel = require('../models/organization-model');
const logger = require('../../../core/services/logger')


//get all org (paginated)
async function getAllOrg(req,res){
  const page = req.query.page ?? 1;
  const limit = req.query.limit ?? 10;

  try {
    const total = await orgModel.countDocuments();

    const orgs = await orgModel.find()
    .skip((page -1) * limit)
    .limit(limit)
    .select("-password");


    return res.status(200).json({
      total,
      data: orgs,
    })


  } catch (error) {
    logger.error('GetAll org error: ' + (error && error.message ? error.message : String(error)));
    return res.status(500).json({message: error.message});
  }
}

//search org
async function search(req,res){
  //get query
  const q = req.query.q;

  try {
    //check if q is empty
    if(!q || q.isEmpty || q == ''){
      return res.status(404).json({message: 'query is empty, atleast 3 character is required to search'});
    }

    //get all matching org
    const orgs = await orgModel.find({name: {$search: q}});

    return res.status(200).json({data: orgs})
  } catch (error) {
    logger.error("Org search error: " + error && error.message ? error.message : string(error));
    return res.status(500).json({message: error.message});
  }
}

//export
module.exports = {
  getAllOrg,
  search
}
