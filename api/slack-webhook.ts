import { NowRequest, NowResponse } from "@now/node";
import { generator, FnrInfo } from "../src/fnr-generator";
import { fnrInfoToEmojiString } from "../src/string-formatter";

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
  if (
    !process.env.FNR_SLACK_TOKENS ||
    !process.env.FNR_SLACK_TOKENS.split(";").includes(req.body.token)
  ) {
    res.json({
      response_type: "ephemeral",
      text: `Slack token incorrect`,
    });
    return;
  }

  // eslint-disable-next-line prefer-const
  let [minAge = "0", maxAge = "120", count = "10"] = req.body.text.split(" ");

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

  const fnrs = generator(Number(minAge), Number(maxAge), Number(count));
  console.debug(
    "minAge: ",
    minAge,
    minAge === "0",
    typeof minAge,
    req.body.text
  );
  const headerBlock: SlackSectionBlock = {
    type: "section",
    text: {
      type: "plain_text",
      text: `Her har du ${count} fødselsnummer(e) til personer i alderen ${minAge}-${maxAge}`,
    },
  };

  res.json({
    response_type: "ephemeral",
    blocks: [headerBlock, ...fnrs.map(generateBlock)],
  });
};
