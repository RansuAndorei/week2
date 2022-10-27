console.log("ASDASDas");
export default async function handler(req, res) {
  console.log("ASDASDSADSA");
  if (req.method === "GET") {
    console.log("ASDASDSADSA");
    try {
      console.log(req.query);
      console.log(req.body);

      return res.status(200).json({ name: "John Doe" });
    } catch (e) {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
  // HTTP method not supported!
  else {
    res.setHeader("Allow", ["GET"]);
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
