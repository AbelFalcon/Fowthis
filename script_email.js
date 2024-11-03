const nodemailer = require('nodemailer');

function enviarCorreo(producto, precioActual, precioGuardado) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASSWORD
        }
    });

    let mailOptions = {
        from: process.env.GMAIL_USER,
        to: process.env.GMAIL_USER,
        subject: `Precio bajó para ${producto.url}`,
        text: `El precio ha bajado para ${producto.url}. Nuevo precio: ${precioActual}, Precio anterior: ${precioGuardado}`
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Correo enviado: ' + info.response);
        }
    });
}

// Argumentos ...

if (require.main === module) {
    const args = process.argv.slice(2);
    if (args.length < 3) {
        console.log('Uso: node script_email.js <productoUrl> <precioActual> <precioGuardado>');
        process.exit(1);
    }

    const producto = { url: args[0] };
    const precioActual = args[1];
    const precioGuardado = args[2];

    enviarCorreo(producto, precioActual, precioGuardado);
}


module.exports = { enviarCorreo };