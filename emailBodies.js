module.exports.invoice = function(checkOutHdrKey, dueDate, amountDue, transactionId, fName) {
    var email = `
        <body>
            <div style="width:600px !important; margin-top:30px;margin-bottom:30px;margin-right:auto;margin-left:auto;outline:1px solid rgb(204,204,204);padding:20px;">
                <table width="600" cellpadding="10">
                    <tbody>
                        <tr>
                            <td colspan="4" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 20px;"><strong>NexToner, LLC</strong></td>
                        </tr>
                        <tr>
                            <td></td>
                        </tr>
                        <tr>
                            <td>
                                <table cellpadding="2">
                                    <tbody>
                                        <tr>
                                            <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; color:rgb(153,153,153);">INVOICE</td>
                                        </tr>
                                        <tr>
                                            <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 22px; color:rgb(51,51,51);">` + checkOutHdrKey + `</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                            <td>
                                <table cellpadding="2">
                                    <tbody>
                                        <tr>
                                        <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; color:rgb(153,153,153);">DUE DATE</td>
                                        </tr>
                                        <tr>
                                        <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 22px; color:rgb(51,51,51);">` + dueDate + `</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                            <td>
                                <table cellpadding="2">
                                    <tbody>
                                        <tr>
                                            <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; color:rgb(153,153,153);">AMOUNT DUE</td>
                                        </tr>
                                        <tr>
                                            <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 22px; color:rgb(51,51,51);">` + amountDue + `</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                            <td>
                                <table cellpadding="2">
                                    <tbody>
                                        <tr>
                                            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 18px; color:rgb(51,51,51);">
                                                <a style="text-decoration:none;" href='https://www.nextoner.com/invoice.asp?action=1::` + transactionId + `'><div style="text-align:center; outline:1px solid rgb(45,106,159); cursor:pointer; padding:10px; background-color:rgb(51,122,183); color:rgb(242,242,242);">View Invoice</div></a>
                                            </div>                                    
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="4"><hr style="background-color:rgb(217,217,217); border-width:0; color:rgb(242,242,242); height:1px; lineheight:0; display: inline-block; text-align: left;"/></td>
                        </tr>
                        <tr>
                            <td colspan="4">
                                <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px;color:rgb(51,51,51);">
                                    
                                    Please click on the button above to see the invoice for your latest toner purchase.<BR><BR>
                                    We appreciate your business,<BR><BR>
                                    The NexToner Team
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </body>
        `
    return email;
}