import productos from "/data/productos.json"

describe('Seguimiento de precios para múltiples productos', () => {

    it('Debería comprobar el precio de cada producto y registrar cambios', () => {
        cy.readFile('data/precios.json').then((data) => {
            if (!data) {
                data = {};
            }

            productos.forEach((producto) => {
                cy.visit(producto.url);

                cy.get(producto.selectorPrecio).first().invoke('text').then((precioActualTexto) => {
                    const precioActual = parseFloat(precioActualTexto.replace(/[^\d,.-]/g, '').replace(',', '.'));
                    cy.log(`El precio actual para ${producto.url} es: ${precioActual}`);

                    const precioGuardado = data[producto.url] || 'No disponible';
                    cy.log(`El precio guardado para ${producto.url} es: ${precioGuardado}`);

                    if (precioGuardado !== 'No disponible') {
                        const precioGuardadoNum = parseFloat(precioGuardado)
                        // TODO: Change logic
                        if (precioActual < precioGuardadoNum) {
                            cy.log(`El precio ha bajado para ${producto.url}!`);
                            cy.exec(`node --env-file .env script_email.js ${producto.url} ${precioActual} ${precioGuardadoNum}`);
                        }
                    }
                    data[producto.url] = precioActual.toString();
                });
            });
            cy.writeFile('data/precios.json', data);
        });
    });
});