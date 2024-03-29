import fs from 'fs';

describe('visitamos pccomponentes para obtener datos de smartphones', () => {
  it('Vamos a pcc', () => {
    visit()
  });

  it('Recorremos los productos', () => {
    cy.get('.zg-item').then(items => {
      items.toArray().slice(40, 49).forEach((item, index) => {

        index = index + 40;
        const product = {}
        cy.get('.zg-item').eq(index).click();
        cookies();

        cy.get('body').then(body => {
          if (body.find('#productTitle').length) {
            cy.get('#productTitle').then(title => {
              product.title = title.text().trim();
            });
          }
        })

        cy.get('body').then(body => {
          if (body.find('#newBuyBoxPrice').length) {
            cy.get('#newBuyBoxPrice').then(price => {
              product.price = price.text().trim();
            })
          } else if (body.find('#price_inside_buybox').length) {
            cy.get('#price_inside_buybox').then(price => {
              product.price = price.text().trim();
            })
          }
        })

        cy.get('body').then(body => {
          if (body.find('.imageThumbnail').length) {
            cy.get('.imageThumbnail').each(thumb => {
              cy.wrap(thumb).trigger('mouseenter').trigger('mouseover').click({ force: true });
              cy.wait(2000)
              cy.get('.image.item.selected img.a-dynamic-image').eq(0).then(img => {
                if (product.image) {
                  product.image.push(img.prop('src'));
                } else {
                  product.image = [img.prop('src')]
                }
              });
            })
          }
        })

        cy.get('body').then(body => {
          if (body.find('#detailBullets_feature_div > .a-unordered-list li').length) {
            cy.get('#detailBullets_feature_div > .a-unordered-list li').each(prop => {
              cy.wrap(prop).within(() => {
                cy.get('.a-text-bold').then(caract => {
                  cy.get('.a-list-item > :nth-child(2)').then(desc => {
                    const full = {}
                    full[caract.text().trim().trim().replace('\n', '')] = desc.text().trim();
                    if (product.feature) {

                      product.feature.push(full);
                    } else {
                      product.feature = [full]
                    }
                  })
                })
              })
            })
          }
        })

        cy.get('body').then(body => {
          if (body.find('#feature-bullets > .a-unordered-list > li').length) {

            cy.get('#feature-bullets > .a-unordered-list > li').each(description => {
              cy.wrap(description).within(() => {
                cy.get('.a-list-item').then(desc => {
                  if (product.description) {
                    product.description.push(desc.text().trim())
                  } else {
                    product.description = [desc.text().trim()]
                  }
                })
              })
            })
          }
        })

        cy.get('body').then(() => {
          console.log(product)
          cy.writeFile(`./Laptop/${product.title.substring(0, 25).replace('/', '').trim()}.json`, JSON.stringify(product))
        })
        visit();
      })
    })
  })
})

function visit() {
  cy.visit('https://www.amazon.es/gp/bestsellers/computers/938008031?ref_=Oct_d_obs_S&pd_rd_w=v6FFy&pf_rd_p=62dfbf75-5eb5-4489-a0aa-2d40ffc9f548&pf_rd_r=Y0BE6JXFF2KXBE2XR1B0&pd_rd_r=56bd5578-d05d-4961-ad87-936da0ec1df8&pd_rd_wg=Yi0UM');
  cy.get('body').then(body => {
    if (body.find('.a-button-input').length) {
      cy.get('.a-button-input').click();
    }
  })
}

function cookies() {
  cy.get('body').then(body => {

    if (body.find('#sp-cc-accept').length) {
      cy.get('#sp-cc-accept').click();
    }
  });
}