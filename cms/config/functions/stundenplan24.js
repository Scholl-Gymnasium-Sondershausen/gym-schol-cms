const es6Request = require( 'es6-request' );
const xml2js = require( 'xml2js' );
const moment = require( "moment" );

let getReplacement = async function( replacements ) {

  let schoolClasses = []
  for ( var replacement of replacements ) {
    let teacher = await getAndInsertTeacher( [((replacement.lehrer[0]["_"] === undefined) ? replacement.lehrer[0] : replacement.lehrer[0]["_"])] )
    let classRep = await getClass( [((replacement.klasse[0]["_"] === undefined) ? replacement.klasse[0] : replacement.klasse[0]["_"])] )

    let returnObject = {
      "subject": ((replacement.fach[0]["_"] === undefined) ? replacement.fach[0] : replacement.fach[0]["_"]),
      "room": ((replacement.raum[0]["_"] === undefined) ? ((typeof replacement.raum[0] === 'string' || replacement.raum[0] instanceof String)? replacement.raum[0]: undefined) : replacement.raum[0]["_"]),
      "description": replacement.info[0],
      "hour": replacement.stunde[0],
      "schulklassens": classRep,
      "teachers": teacher,
    }

    let entry = await strapi.query( 'replacement' ).create( returnObject );
    if ( entry !== null ) {
      schoolClasses.push(entry)
    }

  }
  return schoolClasses
}

let getClass = async function( changesClasses ) {

  let schoolClasses = []
  for ( var changesClass of changesClasses ) {
    let entry = await strapi.query( 'schoolClass' ).findOne( {Name: changesClass.trim()} );
    if ( entry !== null ) {
      schoolClasses.push( entry )
    } else {
      let newEntry = await strapi.query( 'schoolClass' ).create( {
                                                                   Name: changesClass.trim()
                                                             } );
      schoolClasses.push( newEntry )
    }

  }
  return schoolClasses
}
let getAndInsertTeacher = async function( changesTeachers ) {

  let schoolTeachers = []
  for ( var changesTeacher of changesTeachers ) {
    if (typeof changesTeacher === 'string' || changesTeacher instanceof String) {
      let name = changesTeacher.trim()
      let surname = name.replace("Herr ", "").replace("Frau ", "")
      let gender = ((name.indexOf("Herr") === -1) ? "Frau" : "Herr")
      let entry = await strapi.query( 'teacher' ).findOne( {Surname: surname} );
      if ( entry === null ) {
        let newEntry = await strapi.query( 'teacher' ).create( {
                                                                 Surname: surname,
                                                                 gender: gender
                                                               } );
        schoolTeachers.push( newEntry )
      } else {
        schoolTeachers.push( entry )
      }
    }

  }
  return schoolTeachers

}

let getRepresentationPlan = async function( searchUrl, callback ) {
  await es6Request.get( searchUrl )
    .authBasic( "schueler", "S435e93" )
    .then( ( [body, res] ) => {
      if ( res.statusCode === 200 ) {
        xml2js.parseString( body, function( err, result ) {
          callback( result )
        } )
      }
    } );
}

module.exports = async () => {
  let dateString = moment().format( "YYYYMMDD" )
  let searchUrl = "https://www.stundenplan24.de/30076450/vplan/vdaten/VplanKl" + dateString + ".xml"


  //

  await getRepresentationPlan( searchUrl, async ( result ) => {
    let {vp} = result
    let {kopf, aufsichten, haupt} = vp
    let {titel, schulname, datum, kopfinfo} = kopf[0]
    let {abwesendl, abwesendk, aenderungl, aenderungk} = kopfinfo[0]
    let {aktion} = haupt[0]
    let createDate = moment( datum[0], 'DD.MM.YYYY, HH:mm' ).toISOString()
    let entry = await strapi.query( 'representationPlan' ).find( {ErstellungsDatum: new Date(createDate)} );
    if (entry.length === 0) {
      aktion = JSON.stringify( aktion )
      aktion = aktion.replace( /\$/g, "dollar" )
      aktion = JSON.parse( aktion )

      let changesClasses = aenderungk[0].split( "," )
      let changesTeachers = aenderungl[0].split( "," )
      let changesAbsentClasses = abwesendk[0].split( "," )
      let changesAbsentTeachers = abwesendl[0].split( "," )

      let schoolClasses = await getClass( changesClasses )
      let schoolTeachers = await getAndInsertTeacher( changesTeachers )
      let schoolAbsentClasses = await getClass( changesAbsentClasses )
      let schoolAbsentTeachers = await getAndInsertTeacher( changesAbsentTeachers )

      let replacements = await getReplacement( aktion)

      let newEntry = {
        "DatumTitle": titel[0],
        "Schulname": schulname[0],
        "ErstellungsDatum": new Date(createDate),
        "createDate": new Date(),
        "abwesendLehrer": abwesendl[0],
        "abwesendKlassen": abwesendk[0],
        "aenderungLehrer": aenderungl[0],
        "aenderungKlassen": aenderungk[0],
        "aufsichten": aufsichten,
        "vertretung": aktion,
        "school_classes": schoolClasses,
        "teachers": schoolTeachers,
        "absentTeachers": schoolAbsentTeachers,
        "absentClasses": schoolAbsentClasses,
        "replacements": replacements
      }
      await strapi.query( 'representationPlan' ).create( newEntry );

      return newEntry
    } else {
      console.log( JSON.stringify( "has entry" ) );
      return "has entry"
    }



  } )

  console.log( JSON.stringify( true ) );
};
