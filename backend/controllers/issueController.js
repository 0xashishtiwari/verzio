const createIssue = (req, res) => {
  res.send("Issue created!");
};

const updateIssue = (req, res) => {
  res.send("Issue updated");
};
const updateIssueById = (req, res) => {
  res.send("Issue updated!");
};

const deleteIssueById = (req, res) => {
  res.send("Issue deleted");
};
const getAllIssues = (req, res) => {
  res.send("all issue of repo fetched");
};
const getIssueById = (req, res) => {
  res.send("Issue details fetched");
};

module.exports = {
  createIssue,
  updateIssue,
  updateIssueById,
  deleteIssueById,
  getAllIssues,
  getIssueById,
};
