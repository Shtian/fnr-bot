import { NowRequest, NowResponse } from "@now/node";
import { generator, FnrInfo } from "../src/fnr-generator";
import { fnrInfoToEmojiString } from "../src/string-formatter";
import { verifySignature } from "../src/verify-signature";

interface SlackText {
  type: "plain_text" | "mrkdwn";
  text: string;
}

interface SlackSectionBlock {
  type: "section";
  text: SlackText;
}

const generateBlock = ({ age, gender, fnr }: FnrInfo): SlackSectionBlock => {
  return {
    type: "section",
    text: { type: "plain_text", text: fnrInfoToEmojiString(age, gender, fnr) },
  };
};

export default (req: NowRequest, res: NowResponse): void => {
  if (!verifySignature(req, process.env.FNR_SLACK_SIGNING_SECRET)) {
    res.json({
      response_type: "ephemeral",
      text: `Slack token incorrect`,
    });
    return;
  }

  // eslint-disable-next-line prefer-const
  let [minAge, maxAge = "120", count = "10"] = req.body.text.split(" ");

  if (Number(minAge) > Number(maxAge)) {
    res.json({
      response_type: "ephemeral",
      text: `Min age cannot be higher than max age`,
    });
    return;
  }

  if (!count) {
    count = 1;
  } else if (Number(count) > 50) {
    count = 50;
  }

  if (minAge === "") minAge = "0";

  const fnrs = generator(Number(minAge), Number(maxAge), Number(count));

  const headerBlock: SlackSectionBlock = {
    type: "section",
    text: {
      type: "plain_text",
      text: `Absolutely! 🫡 ${count} fødselsnummer(e) med alderen ${minAge}-${maxAge} år:`,
    },
  };

  res.json({
    response_type: "ephemeral",
    blocks: [headerBlock, ...fnrs.map(generateBlock)],
  });
};
