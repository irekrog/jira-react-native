import axios from 'axios';

const createArrayWithTaskAndHours = (data) => {
  const arr = [];
  const len = data.length;

  for (let i = 0; i < len; i++) {
    let secondsWorked = data[i].timeSpentSeconds;
    let id = data[i].issue.id;
    arr.push([id, secondsWorked]);
  }
  return arr;
};

export default (username, password, jiraLink, obj) => (
  axios({
    url: `${jiraLink}/rest/tempo-timesheets/3/worklogs/`,
    auth: {
      username,
      password
    }
  })
    .then(response => {
      const arr = createArrayWithTaskAndHours(response.data);
      obj.setState({
        arrWithTimes: arr
      });
    })
    .catch(error => {
      console.log(error);
    })
);
