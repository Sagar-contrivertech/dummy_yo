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

const s3 = new AWS.S3({ apiVersion: '2006-03-01' })

exports.addbussiness = catchAsyncErrors(async (req, res) => {
    try {
        console.log(req.file , "req.file")
        // bussinessImage = req.file.path
        // const finduser = await BusinessOwner.findOne({ name: req.body.name });

        // if (finduser) {

        //     res.status(400).json({
        //         success: false,
        //         message: 'owner exsit with same credtinals',
        //     })

        //     return

        // }
        console.log(req.file , req.body) 
        const createOwner = await BusinessOwner.create({ name : req.body.name, bussinessLogo : req.file.path})

        if (!createOwner) {
            res.status(400).json({
                success: false,
                message: 'cannot create ',
            })
            return
        }

        if (createOwner) {
            await createOwner.save()
            res.status(200).json({
                success: true,
                message: 'create user',
                data: createOwner
            })
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
        console.log(req)
        const findusers = await BusinessOwner.find()

        if (!findusers) {
            res.status(400).json({
                success: false,
                message: "getUsers failled in try",
            });
        }

        if (findusers) {
            res.status(200).json({
                success: true,
                message: "getUsers Succesfully",
                data: findusers
            });
        }
        // const findusers = await BusinessOwner.find({}, function (err, allDetails) {
        //     if (err) {
        //         console.log(err);
        //     } else {
        //         res.render("index", { details: allDetails })
        //     }
        // })
        // if (!findusers) {
        //     res.status(400).json({
        //         success: false,
        //         message: "getBussiness failled in try",
        //     });
        // }

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