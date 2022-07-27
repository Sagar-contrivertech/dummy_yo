const express = require("express")
const BusinessOwner = require('../models/businessOwner')
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const AWS = require("aws-sdk")
const fs = require("fs")
const multer = require("multer")
const accessId = "AKIATP3PFG7VQYNFTUGA"
const secretKey = "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"
const BUCKET_NAME = "yoborsto"
const q = require('q')

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

        const finduser = await BusinessOwner.findOne({ name: req.body.name });

        if (finduser) {

            res.status(400).json({
                success: false,
                message: 'owner exsit with same credtinals',
            })

            return

        }

        let fileObject = [
            {
                key: req.files.bussinessLogo[0].originalname,
                value: req.files.bussinessLogo[0].buffer,
                filekey: 'bussinessLogo'
            },
            {
                key: req.files.bussinessImages[0].originalname,
                value: req.files.bussinessImages[0].buffer,
                filekey: 'bussinessImages'
            },
            {
                key: req.files.bannerImage[0].originalname,
                value: req.files.bannerImage[0].buffer,
                filekey: 'bannerImage'
            },
            {
                key: req.files.owneridproofurl[0].originalname,
                value: req.files.owneridproofurl[0].buffer,
                filekey: 'owneridproofurl'
            },
            {
                key: req.files.ownerImage[0].originalname,
                value: req.files.ownerImage[0].buffer,
                filekey: 'ownerImage'
            }
        ]
        // let FileNameSplit = [
        //     {
        //         "bussinessLogo": req.files.bussinessLogo[0].originalname,
        //         "bussinessImages": req.files.bussinessImages[0].originalname,
        //         "bannerImage": req.files.bannerImage[0].originalname,
        //         'owneridproofurl': req.files.owneridproofurl[0].originalname,
        //         'ownerImage': req.files.ownerImage[0].originalname,
        //     }
        // ]
        // console.log(FileNameSplit, fileObject)





        let newupdateobject = await uploadMultipleFiles(fileObject).then(data => {
            console.log(data, '79')
            return data
        }).catch((err) => {
            console.log(err)
        })
        console.log(newupdateobject, '77')

        let ownerImage, owneridproofurl, bannerImage, bussinessLogo

        newupdateobject && newupdateobject.map(m => {
            if (m.key === 'owneridproofurl') {
                console.log(m.Location)
                owneridproofurl = m.Location
                return m.Location
            }

            if (m.key === 'ownerImage') {
                console.log(m.Location, ';owner')
                ownerImage = m.Location
                return m.Location
            }

            if (m.key === 'bannerImage') {
                console.log(m.Location, ';bannerImage')
                bannerImage = m.Location
                return m.Location
            }

            if (m.key === 'bussinessImages') {
                console.log(m.Location, ';bussinessImages')
                bussinessImages = m.Location
                return m.Location
            }

            if (m.key === 'bussinessLogo') {
                console.log(m.Location, ';bussinessLogo')
                bussinessLogo = m.Location
                return m.Location
            }
        })

        console.log(ownerImage, owneridproofurl, bannerImage, bussinessLogo, '87',)
        // clear

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
            isactive:req.body.isactive,

            // images
            bussinessLogo: bussinessLogo,
            bussinessImages: bussinessImages,
            bannerImage: bannerImage,
            owneridproofurl: owneridproofurl,
            ownerImage: ownerImage,
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


async function uploadMultipleFiles(fileObject) {
    console.log(fileObject , "fileobject")
    const deferred = q.defer();
    let s3response = []
    try {

        for (const file of fileObject) {
            const params = {
                Bucket: BUCKET_NAME,
                Key: file.key, // File name you want to save as in S3
                Body: file.value,
                ContentEncoding: 'base64',
                ContentType: 'image/jpeg'
            };
            const data = await s3.upload(params).promise()
            console.log(data, '255')
            s3response.push({

                key: file.filekey,
                fileName: data.key,
                Location: data.Location
            })
        }

    } catch (err) {
        console.log(err)
    }
    deferred.resolve(s3response)
    console.log(deferred , "deferred")
    return deferred.promise

}