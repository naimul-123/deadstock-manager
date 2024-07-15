
export function convertBengaliNumerals(bengaliNumeralString) {
    const bengaliToNumeric = {
        '০': 0, '১': 1, '২': 2, '৩': 3, '৪': 4,
        '৫': 5, '৬': 6, '৭': 7, '৮': 8, '৯': 9
    };

    let numericString = "";
    for (let char of bengaliNumeralString) {
        if (bengaliToNumeric[char] !== undefined) {
            numericString += bengaliToNumeric[char];
        } else {
            numericString += char; // handle non-numeric characters as is
        }
    }

    return numericString;
}


const toben = (n) => {
    const intPart = parseInt(n);

    const words = [
        "", "এক", "দুই", "তিন", "চার", "পাঁচ", "ছয়", "সাত", "আট", "নয়", "দশ",
        "এগারো", "বারো", "তেরো", "চৌদ্দ", "পনেরো", "ষোল", "সতেরো", "আঠারো", "উনিশ", "বিশ",
        "একুশ", "বাইশ", "তেইশ", "চব্বিশ", "পঁচিশ", "ছাব্বিশ", "সাতাশ", "আঠাশ", "ঊনত্রিশ", "ত্রিশ",
        "একত্রিশ", "বত্রিশ", "তেত্রিশ", "চৌত্রিশ", "পঁইত্রিশ", "ছত্রিশ", "সাইত্রিশ", "আটত্রিশ", "ঊনচল্লিশ", "চল্লিশ",
        "একচল্লিশ", "বিয়াল্লিশ", "তেতাল্লিশ", "চুয়াল্লিশ", "পঁয়তাল্লিশ", "ছেচল্লিশ", "সাতচল্লিশ", "আটচল্লিশ", "ঊনপঞ্চাশ", "পঞ্চাশ",
        "একান্ন", "বায়ান্ন", "তিপ্পান্ন", "চুয়ান্ন", "পঞ্চান্ন", "ছাপ্পান্ন", "সাতান্ন", "আটান্ন", "ঊনষাট", "ষাট",
        "একষট্টি", "বাষট্টি", "তেষট্টি", "চৌষট্টি", "পঁষট্টি", "ছেষট্টি", "সাতষট্টি", "আটষট্টি", "ঊনসত্তর", "সত্তর",
        "একাত্তর", "বাহাত্তর", "তিয়াত্তর", "চুয়াত্তর", "পঁচাত্তর", "ছিয়াত্তর", "সাতাত্তর", "আটাত্তর", "ঊনআশি", "আশি",
        "একাশি", "বিরাশি", "তিরাশি", "চুরাশি", "পঁচাশি", "ছিয়াশি", "সাতাশি", "আটাশি", "ঊননব্বই", "নব্বই",
        "একানব্বই", "বিরানব্বই", "তিরানব্বই", "চুরানব্বই", "পঁচানব্বই", "ছিয়ানব্বই", "সাতানব্বই", "আটানব্বই", "নিরানব্বই",
    ]

    const decimalval = parseInt((parseFloat(n) - intPart) * 100.01)
    const decimalWord = decimalval ? `এবং পয়সা ${words[decimalval]}` : ''
    const tenthVal = parseInt(((intPart / 100) - parseInt((intPart / 100))) * 100.01);
    const tenthWord = tenthVal ? words[tenthVal] : ''
    const hundVal = parseInt(((intPart / 1000) - parseInt((intPart / 1000))) * 10);
    const hundWord = hundVal ? `${words[hundVal]}শত` : ''
    const thousVal = parseInt(((intPart / 100000) - parseInt((intPart / 100000))) * 100);
    const thousWord = thousVal > 0 ? `${words[thousVal]} হাজার` : ''
    const lakhVal = parseInt(((intPart / 10000000) - parseInt((intPart / 10000000))) * 100);
    const lakhWord = lakhVal > 0 ? `${words[lakhVal]} লক্ষ` : ''
    const crorVal = parseInt(((intPart / 1000000000) - parseInt((intPart / 1000000000))) * 100);
    const crorWord = crorVal > 0 ? `${words[crorVal]} কোটি` : ''

    return n > 0 ? `টাকা ${crorWord} ${lakhWord} ${thousWord} ${hundWord} ${tenthWord}  ${decimalWord} মাত্র ` : ''
}

export const benWord = (n) => {
    return toben(convertBengaliNumerals(n))
}
const toeng = (n) => {
    const intPart = parseInt(n);

    const words = [
        "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
        "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen", "Twenty",
        "Twenty-One", "Twenty-Two", "Twenty-Three", "Twenty-Four", "Twenty-Five", "Twenty-Six", "Twenty-Seven", "Twenty-Eight", "Twenty-Nine", "Thirty",
        "Thirty-One", "Thirty-Two", "Thirty-Three", "Thirty-Four", "Thirty-Five", "Thirty-Six", "Thirty-Seven", "Thirty-Eight", "Thirty-Nine", "Forty",
        "Forty-One", "Forty-Two", "Forty-Three", "Forty-Four", "Forty-Five", "Forty-Six", "Forty-Seven", "Forty-Eight", "Forty-Nine", "Fifty",
        "Fifty-One", "Fifty-Two", "Fifty-Three", "Fifty-Four", "Fifty-Five", "Fifty-Six", "Fifty-Seven", "Fifty-Eight", "Fifty-Nine", "Sixty",
        "Sixty-One", "Sixty-Two", "Sixty-Three", "Sixty-Four", "Sixty-Five", "Sixty-Six", "Sixty-Seven", "Sixty-Eight", "Sixty-Nine", "Seventy",
        "Seventy-One", "Seventy-Two", "Seventy-Three", "Seventy-Four", "Seventy-Five", "Seventy-Six", "Seventy-Seven", "Seventy-Eight", "Seventy-Nine", "Eighty",
        "Eighty-One", "Eighty-Two", "Eighty-Three", "Eighty-Four", "Eighty-Five", "Eighty-Six", "Eighty-Seven", "Eighty-Eight", "Eighty-Nine", "Ninety",
        "Ninety-One", "Ninety-Two", "Ninety-Three", "Ninety-Four", "Ninety-Five", "Ninety-Six", "Ninety-Seven", "Ninety-Eight", "Ninety-Nine"
    ]

    const decimalval = parseInt((parseFloat(n) - intPart) * 100.01)
    const decimalWord = decimalval ? `and Paisa ${words[decimalval]}` : ''
    const tenthVal = parseInt(((intPart / 100) - parseInt((intPart / 100))) * 100.01);
    const tenthWord = tenthVal ? words[tenthVal] : ''
    const hundVal = parseInt(((intPart / 1000) - parseInt((intPart / 1000))) * 10);
    const hundWord = hundVal ? `${words[hundVal]} Hundred` : ''
    const thousVal = parseInt(((intPart / 100000) - parseInt((intPart / 100000))) * 100);
    const thousWord = thousVal > 0 ? `${words[thousVal]} Thousand` : ''
    const lakhVal = parseInt(((intPart / 10000000) - parseInt((intPart / 10000000))) * 100);
    const lakhWord = lakhVal > 0 ? `${words[lakhVal]} Lakh` : ''
    const crorVal = parseInt(((intPart / 1000000000) - parseInt((intPart / 1000000000))) * 100);
    const crorWord = crorVal > 0 ? `${words[crorVal]} Cror` : ''

    return n > 0 ? `Taka ${crorWord} ${lakhWord} ${thousWord} ${hundWord} ${tenthWord}  ${decimalWord} Only ` : ''
}

export const engWord = (n) => {
    return toeng(convertBengaliNumerals(n))
}

export const indianNumberFormat = (n) => {
    const bengliToDecimalMap = {
        '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4', '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
    }

    const decimalToBengaliMap = {
        '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
    }

    let decimalNumberString = n.replace(/[০-৯]/g, (match) => {
        return bengliToDecimalMap[match];
    })

    let [integerPart, decimalPart] = decimalNumberString.split('.')
    let chars = integerPart.split('');
    chars = chars.reverse();
    let formattedChars = [];
    for (let i = 0; i < chars.length; i++) {
        if (i > 2 && (i - 2) % 2 === 1) {
            formattedChars.push(',')
        }
        formattedChars.push(chars[i])
    }
    let intigerPart = formattedChars.reverse().join('');
    if (decimalPart) {
        decimalPart = `.${decimalPart.slice(0, 2)}`;
        if (decimalPart.length < 2) {
            decimalPart = `.${decimalPart}0`
        }
    }
    else {
        decimalPart = '/-'
    }

    let formatedDecimalNumber = `${intigerPart}${decimalPart}`
    let formatedBengaliNumber = formatedDecimalNumber.replace(/[0-9]/g, (match) => {
        return decimalToBengaliMap[match]
    })

    return formatedBengaliNumber

}