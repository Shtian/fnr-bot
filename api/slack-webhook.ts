import { NowRequest, NowResponse } from '@now/node';
import { generator } from '../src/fnr-generator'

export default (req: NowRequest, res: NowResponse) => {
    console.log(process.env.FNR_SLACK_TOKEN);
    console.log(req.body);
    const [minAge = "0", maxAge = "120", count = "10"] = req.body.text.split('');
    res.json({
        "response_type": "ephemeral",
        "text": `Message recieved: ${minAge} ${maxAge} ${count}`
    });
}