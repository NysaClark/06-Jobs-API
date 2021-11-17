const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequest } = require("../errors");
const Job = require("../models/Job");

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userID }).sort(
    "created at"
  );
  res.status(StatusCodes.OK).json({ jobs, length: jobs.length });
};

const getJob = async (req, res) => {
  const { userID } = req.user;
  const { id: jobID } = req.params;

  const job = await Job.findOne({ createdBy: userID, _id: jobID });
  if (!job) {
    throw new NotFoundError(`no job with id ${jobID}`);
  }

  res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userID;
  const job = await Job.create(req.body);

  res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req, res) => {
  const { company, position } = req.body;
  const { userID } = req.user;
  const { id: jobID } = req.params;

  // const {
  //   body: {company, position},
  //   user: {userID},
  //   params: {id: jobID}
  // } = req

  if (!company || !position) {
    throw new BadRequest("Please provide company AND position");
  }

  const job = await Job.findByIdAndUpdate(
    { _id: jobID, createdBy: userID },
    req.body,
    { new: true, runValidators: true }
  );

  if (!job) {
    throw new BadRequest(`No job with id ${jobID}`);
  }

  res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
  const {
    params: { id: jobID },
    user: { userID },
  } = req;

  const job = await Job.findOneAndRemove({ _id: jobID, createdBy: userID });

  if (!job) {
    throw new BadRequest(`No job with id ${jobID} found`);
  }

  res.status(StatusCodes.OK).json({ job });
};

module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob };
