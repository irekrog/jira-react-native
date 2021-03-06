import axios from 'axios';

export default (username, password, jiraLink, obj) => (
  axios({
    url: `${jiraLink}/rest/api/2/myself`,
    auth: {
      username,
      password
    }
  })
    .then(response => {
      obj.setState({
        userInfo: response.data.displayName,
        avatar: response.data.avatarUrls['32x32']
      });
    })
    .catch(() => {
      obj.setState({
        userInfo: '',
        avatar: ''
      });
    })
);
