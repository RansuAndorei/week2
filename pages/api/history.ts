export default async function handler(req, res) {
  if (req.method === "POST") {
    console.log("ASDSADASDASDAS");
    if (req.query.secret !== process.env.REVALIDATE_SECRET) {
      return res.status(401).json({ message: "Invalid token" });
    }

    try {
      console.log(req.query);
      console.log(req.body);

      return res.status(200).json({});
    } catch (e) {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
  // HTTP method not supported!
  else {
    res.setHeader("Allow", ["POST"]);
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
