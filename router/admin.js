const router = require("express").Router();
const productSchema = require("./../schema/product");
const fs = require("fs");
const path = require("path");
const prodTypeSchema = require("./../schema/productType");
router.route("/123").get(async (req, res) => {
  let dirE = path.join(__dirname, "../public/images/");
  fs.unlinkSync(`${dirE}${`1080PIPCAMERA_main.jpeg`}`);
  res.json("success");
});
router.route("/deleteprod/:type/:id").get(async (req, res) => {
  let dirE = path.join(__dirname, "../public/images/");

  productSchema.findOne({ productType: req.params.type }).then((prod) => {
    prod.products.map((sProd) => {
      if (sProd._id == req.params.id) {
        console.log(sProd._id);
        fs.unlinkSync(`${dirE}${sProd.mainImage}`);
        sProd.images.map((img) => {
          fs.unlinkSync(`${dirE}${img.url}`);
        });
      }
    });
  });
  await productSchema.findOneAndUpdate(
    { productType: req.params.type },
    { $pull: { products: { _id: req.params.id } } },
    { new: true },
    function (err, result) {
      if (err) {
        console.log(err);
      }
      res.json("success");
    }
  );
});
router.route("/addprodtype/:id").get(async (req, res) => {
  prodTypeSchema.findOne({}).then((result) => {
    result.prodType.push(req.params.id);
    result.save((err, doc) => {
      if (err) {
        console.log(err);
      } else {
        res.json(doc);
      }
    });
  });
});
router.route("/getallprodtype").get(async (req, res) => {
  prodTypeSchema.findOne({}).then((result) => {
    res.json({ success: true, data: result.prodType });
  });
});
router.route("/getallprod").get(async (req, res) => {
  let products = [];
  productSchema.find({}).then((result) => {
    result.map((item) => {
      products = [...products, ...item.products];
    });
    res.json(products);
  });
});

router.route("/getconcrettypeprod/:type").get(async (req, res) => {
  if (req.params.type === "all-Audio") {
    /*
Surface_Mount_Ceiling_Speaker
Mini_Smart_Music_Host
Network_Smart_Music_Sys
Smart_Central_Music_Sys
Economic_Music_Sys
Speaker
EN54_Ceiling_Speaker
Fireproof_Ceiling_Speaker
Two-Way_Ceiling_Speaker
Coaxial_Ceiling_Speaker
Flush_Mount_Ceiling_Speaker*/
    const typeArr = [
      "Audio_Products",
      "Surface_Mount_Ceiling_Speaker",
      "Flush_Mount_Ceiling_Speaker",
      "Coaxial_Ceiling_Speaker",
      "Fireproof_Ceiling_Speaker",
      "Two-Way_Ceiling_Speaker",
      "EN54_Ceiling_Speaker",
      "Speaker",
      "Mini_Smart_Music_Host",
      "Network_Smart_Music_Sys",
      "Smart_Central_Music_Sys",
      "Economic_Music_Sys",
    ];
    productSchema.find().then((rr) => {
      let result = [];
      rr.map(item2 => {
      typeArr.map((item) => {
          if (item2.productType === item) {
            console.log("test")
            result.push(item2)
          }
        })
      });
    res.json(result);
    });
  } else {
    productSchema
      .find({ productType: req.params.type })
      .then(async (result) => {
        await res.json(result);
      });
  }
});
router.route("/getconcretprod/:id").get(async (req, res) => {
  productSchema.find({}).then((result) => {
    console.log(result);
    result.map((Ptype) => {
      Ptype.products.map((prod) => {
        if (prod._id.toString() == req.params.id.toString()) {
          res.json({ product: prod, productType: Ptype.productType });
        }
      });
    });
  });
});
module.exports = router;
