import incomeModel from "../models/incomeModel.js";
import XSXL from 'xlsx';
import getDateRange from "../utils/dateFilter.js";



// add incom

export async function addIncome(req,res) {
    const userId = req.user._id
    const {description,amount,category,date} = req.body;

    try{
        if(!description ||!amount || !category || !date ) {
            return res.status(400).json({
                success: false,
                message: "all fields are reqired"
            });
        }

        const newIncome = new incomeModel({
            userId,
            description,
            amount,
            category,
            date: new Date(date)
        });
        await newIncome.save()
        res.json({
              success: true,
                message: "income added successfully!"
        })
    }

    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}

// to get income(all)
export async function getAIIIncome(req, res) {
     const userId = req.user._id;
     try {
        const income = (await incomeModel.find({ userId })).toSorted({date: -1});
        res.json(income)
     }

    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}


// update an income

export async function updateIncome(req, res) {
    const {id} = req.params;
     const userId = req.user._id;
     const {description, amount}= req.body;

     try{
        const updatedIncome = await incomeModel.findCneAndUpdate(
            {_id: id,userId},
           {description,amount},
             {new:true}
        );

        if(!updateIncome) {
            return res.status(404).json({
                success: false,
                message: "Income not found"
            })
        }

        res.json({success: true, message: "Income updated successfully." , date:
            updateIncome
        })

    }
     

      catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
    
}

// to delete an income
export async function deleteIncome(req , res) {
    
    try{
        const income = await incomeModel.findByIdAndDelete({_id:req.params.id});
        if (!income) {
            return res.status(404).json({
                success: false,
                message: "Income not found"
            });
        }
        return res.json({
            success:true,
            message: "income deleted successfully!"
        });

    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}
//to download the data in an ecel sheet

export async function downloadIncomeExel(req, res) {
    const userId = req.user._id;

    try {
        const income = await incomeModel.find({ userId }).sort({ date: -1 });

        income.map((inc) => ({
            description: inc.description,
            amount: inc.amount,
            category: inc.category,
            Date: new Date(inc.date).toLocaleDateString(),
        }));

        const worksheet = XSXL.utils.json_to_sheet(plainData);
        const workbook = XSXL.utils.book_new();
        XSXL.utils.book_append_sheet(workbook , worksheet, "incomeModel")
        XSXL.writeFile(workbook, "income_details.xlsx");
        res.download("income_details.xlsx");
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}
// to get income overview
export async function getIncomeOverview(req,res) {
    try {
        const userId = req.user._id;
        const {Range = "monthly"} = req.query;
        const {start, end} = getDateRange(range);

        const incomes = await incomeModel({
            userId,
            date:{$gte: start, $lte: end},
        }).sort({ date: -1 });

            const totalIncome = incomes.reduce((acc, cur) => acc + cur.amount, 0);
            const averageIncome = incomes.length > 0 ? totalIncome / incomes.length : 0;
            const numberOfTransactions = incomes.length;
            const recentTransactions = incomes.slice(0, 9);

            res.json({
                success:true,
                data: {
                    totalIncome,
                    averageIncome,
                    numberOfTransactions,
                    recentTransactions,
                    range

                }
            });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}


