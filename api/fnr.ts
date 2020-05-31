import { NowRequest, NowResponse } from "@now/node";
import { generator } from "../src/fnr-generator";

export default (req: NowRequest, res: NowResponse) => {
  const minAge = req.query.minAge || 0;
  const maxAge = req.query.maxAge || 120;
  const numberOfFnrs = req.query.count || 10;

  const fnrs = generator(Number(minAge), Number(maxAge), Number(numberOfFnrs));
  res.json(fnrs);
};
