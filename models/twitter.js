const Twitter = require("twitter");

/**
 * @class TwitterApp - to manage the streaming of our app....
 */
class TwitterApp {
  constructor(Config) {
    this.threadArray = [];
    this.T = new Twitter(Config);
  }

  /**
   * @method stream - starts the stream
   * @params - null
   */
  stream() {
    this.T.stream(
      "statuses/filter",
      { track: process.env.TWITTERKEYWORD },
      (stream) => {
        console.log("Stream has started");
        stream.on("data", (tweet) => {
          this.getThread(tweet.in_reply_to_status_id_str); // function to pull the thread...
        });
      }
    );
  }

  /**
   * @method getThread - fulls the thread after the stream gets the keyword
   * @param {*} id - tweet id.
   */

  getThread(id) {
    this.T.get("statuses/lookup", { id }, (err, tw, res) => {
      let tweet_ = tw[0];
      const {
        id_str,
        text,
        in_reply_to_status_id: tweetID,
        in_reply_to_status_id_str: tweetIdStr,
        in_reply_to_user_id: inReplyToID,
        in_reply_to_user_id_str: inReplyToIdStr,
        user,
      } = tweet_;

      this.threadArray.push(text);
      console.log(this.threadArray);
      if (tweetIdStr !== null) {
        this.cb(tweetIdStr);
        console.log(text);
      } else {
        console.log(text);
      }
    });
  }
  /**
   * @method cb - a callback for the getThreads method
   * @params id - tweetId
   */
  cb(id) {
    this.getThread(id);
  }
}

module.exports = TwitterApp;
