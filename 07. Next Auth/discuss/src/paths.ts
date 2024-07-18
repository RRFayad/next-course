const paths = {
  home() {
    return "/";
  },
  topicShow(topicName: string) {
    return `/topics/${topicName}`;
  },
  postCreate(topicName: string) {
    return `/topics/${topicName}/posts/new`;
  },
  postShow(topicName: string, postId: string) {
    return `/topics/${topicName}/posts/${postId}`;
  },
};

export default paths;
