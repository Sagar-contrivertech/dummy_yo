const express = require("express")
const BusinessOwner = require('../models/businessOwner')
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const AWS = require("aws-sdk")
const fs = require("fs")
const multer = require("multer")
const multers3 = require("multer-s3");
const { DataBrew } = require("aws-sdk");

const accessId = "AKIATP3PFG7VYJBOYQPE"
const secretKey = "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"
const BUCKET_NAME = "yoborsto"
const axios = require('axios')

AWS.config.credentials = {
    accessKeyId: accessId,
    secretAccessKey: secretKey,
    region: "ap-south-1",
    ACL: "public-read",
}

AWS.config.region = "ap-south-1"

const s3 = new AWS.S3()

exports.addbussiness = catchAsyncErrors(async (req, res) => {
    try {

        // const data = req.body

        // const userdata = axios.get(`http://15.206.203.47:8082/api/v1/get/${data.name}`).then((res) => {
        //     console.log(res.data.data, "res")
        //     return res.data.data
        // }).catch((err) => {
        //     console.log(err)
        // })

        // console.log(userdata.userType)
        // console.log(data.role, "data.role")
        // if (data.role !== userdata.userType) {
        //     res.status(400).json({
        //         success: false,
        //         message: "cannot create the agent This type not match while registration",
        //     });
        //     return
        // }

        const finduser = await BusinessOwner.findOne({ name: req.body.name });

        if (finduser) {

            res.status(400).json({
                success: false,
                message: 'owner exsit with same credtinals',
            })

            return

        }

        let imageData = []
        let fileContent
        let FileNameSplit
        const newupdateobject = {}
        const fileNamevar = req.body.Images;
        // console.log(fileNamevar, "filenamevar")


        for (let i = 0; i < fileNamevar.length; i++) {

            if (Object.keys(fileNamevar[i])[0] === "logo") {
                fileContent = fs.readFileSync(fileNamevar[i].logo);
                FileNameSplit = fileNamevar[i].logo.split("/")
            } else if (Object.keys(fileNamevar[i])[0] === "ownerImage") {
                fileContent = fs.readFileSync(fileNamevar[i].ownerImage);
                FileNameSplit = fileNamevar[i].ownerImage.split("/")
            } else if (Object.keys(fileNamevar[i])[0] === "bannerImage") {
                fileContent = fs.readFileSync(fileNamevar[i].bannerImage);
                FileNameSplit = fileNamevar[i].bannerImage.split("/")
            } else if (Object.keys(fileNamevar[i])[0] === "idproof") {
                fileContent = fs.readFileSync(fileNamevar[i].idproof);
                FileNameSplit = fileNamevar[i].idproof.split("/")
            }
        }
        console.log(fileContent)
        const params = {
            Bucket: BUCKET_NAME,
            Key: FileNameSplit[FileNameSplit.length - 1], // File name you want to save as in S3
            Body: fileContent,
            ContentType: 'multipart/form-data'
        };
        console.log(params)
        // Uploading files to the bucket

        s3.upload(params, async function (err, data) {
            if (err) {
                throw err;
            }
            fileNamevar && fileNamevar.map(m => {
                if (Object.keys(m).toString() === 'logo') {
                    newupdateobject.logo = data.Location
                }
                else if (Object.keys(m).toString() === 'ownerImage') {
                    newupdateobject.ownerImage = data.Location
                }
                else if (Object.keys(m).toString() === 'bannerImage') {
                    newupdateobject.bannerImage = data.Location
                }
                else {
                    newupdateobject.idproof = data.Location
                }
                return newupdateobject
            })
            // console.log(newupdateobject, "169")

            const createOwner = await BusinessOwner.create({
                name: req.body.name,
                ownerName: req.body.ownerName,
                ownerEmail: req.body.ownerEmail,

                dateOfBirth: req.body.dateOfBirth,
                storeName: req.body.storeName,
                bussinessName: req.body.bussinessName,
                lName: req.body.lName,
                bussinessEmailId: req.body.bussinessEmailId,
                bussinessWebsite: req.body.bussinessWebsite,
                bussinessNIF: req.body.bussinessNIF,
                bussinessType: req.body.bussinessType,
                bussinessServices: req.body.bussinessServices,
                bussinessLandlineNumber: req.body.bussinessLandlineNumber,
                bussinessMobileNumber: req.body.bussinessMobileNumber,
                openingTime: req.body.openingTime,
                closingTime: req.body.closingTime,
                range: req.body.range,
                workSince: req.body.workSince,
                designation: req.body.designation,
                merchant_type: req.body.merchant_type,
                bankName: req.body.bankName,
                bankAccountNumber: req.body.bankAccountNumber,
                bankAccountHolderName: req.body.bankAccountHolderName,
                bankCode: req.body.bankCode,
                currentAddress: req.body.currentAddress,
                // images field 
                Images: [{
                    bannerImage: newupdateobject.bannerImage,
                    owneridproofurl: newupdateobject.idproof,
                    ownerImages: newupdateobject.ownerImage,
                    bussinessLogo: newupdateobject.logo,
                }
                ],
                bussinessImages: req.body.bussinessImages,

                ownerImage: req.body.ownerImage
            })
            if (createOwner) {
                // console.log(imageData, createOwner._id)
                await createOwner.save()
                res.status(200).json({
                    success: true,
                    message: 'create user',
                    data: createOwner
                })
                if (!createOwner) {
                    res.status(400).json({
                        success: false,
                        message: 'cannot create ',
                    })
                    return
                }

            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "validation failled in catch",
        });
    }
})

exports.getBussiness = catchAsyncErrors(async (req, res) => {
    try {
        const findusers = await BusinessOwner.find().populate("name")

        if (!findusers) {
            res.status(400).json({
                success: false,
                message: "getBussiness failled in try",
            });
        }

        if (findusers) {
            res.status(200).json({
                success: true,
                message: "getBussiness Succesfully",
                data: findusers
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "getBussiness failled in catch",
        });
    }
})

exports.getBussinessById = catchAsyncErrors(async (req, res) => {
    try {
        const findusers = await BusinessOwner.findById(req.params.id).populate("name")

        if (!findusers) {
            res.status(400).json({
                success: false,
                message: "getBussinessById failled in try",
            });
        }

        if (findusers) {
            res.status(200).json({
                success: true,
                message: "getBussinessById Succesfully",
                data: findusers
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "getBussinessById failled in catch",
        });
    }
})