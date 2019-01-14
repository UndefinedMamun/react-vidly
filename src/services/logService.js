// import * as Sentry from "@sentry/browser";

function init() {
  // Sentry.init({
  //   dsn: "https://ed13e727bbf140f5b0b55a91ae920b59@sentry.io/1367667"
  // });
}

function log(error) {
  // Sentry.captureException(error);
  console.error(error);
}

export default {
  init,
  log
};
