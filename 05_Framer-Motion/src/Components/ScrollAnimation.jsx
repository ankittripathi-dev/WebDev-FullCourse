import React from "react";
import { motion, useScroll } from "motion/react";

const ScrollAnimation = () => {
  // console.log(useScroll());
  // console.log(useScroll().scrollYProgress);

  const scrollYProgress = useScroll().scrollYProgress

  return (
    <div className="p-20 text-center">
      <motion.div
        className="bg-red-500 w-full origin-left h-3 fixed top-0 left-0"
        style={{
          scaleX:scrollYProgress
        }}
      ></motion.div>

      <h2 className="text-4xl font-bold mb-8">Ankit.dev</h2>
      <p>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Perspiciatis,
        eum quae? Molestiae deleniti nisi id laborum quo sint veritatis alias,
        reiciendis quas eum temporibus repudiandae laboriosam eos autem est,
        dolorem porro dolorum quos eius vitae magni! Ullam atque cum velit in
        excepturi sunt recusandae illum quos nobis minima consequuntur, sequi
        commodi repellat ipsum nam fuga at quaerat eveniet natus aperiam eos quo
        tempore aspernatur. Corporis enim officiis odio eligendi eius, ex porro
        animi odit molestias itaque ipsa consequatur, laudantium praesentium
        sint earum, magnam dolor blanditiis labore nihil. Illum natus nihil id,
        facilis, ad est quia quibusdam excepturi aliquam enim incidunt.
      </p>
      <br />
      <br />
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Assumenda iure
        ea sit doloremque quaerat eum ducimus, vel esse ipsum cum aperiam magni,
        beatae, officia voluptates a. Id cum est quae, perferendis sint fugiat
        quo repudiandae eum et voluptatibus repellat placeat ab eligendi earum
        nemo, eius, magnam illum soluta. Voluptas vitae consequuntur vero magnam
        sit, iure aspernatur est maiores, molestiae iusto repellat! Dolor
        corrupti praesentium nulla voluptatibus quos dolores velit cumque
        doloribus! Nam nobis eos temporibus animi, fugit corporis officiis sunt
        repudiandae rerum consequuntur tempora veritatis! Earum dicta repellat
        quia voluptatibus reprehenderit libero minus culpa rerum, nisi
        doloremque fuga, corrupti ab corporis neque perspiciatis tempora
        sapiente obcaecati quas maxime accusamus quasi fugit sint delectus! Quo
        temporibus corrupti quibusdam facere dolorem maiores labore impedit
        fugit cum. Architecto dignissimos fugiat eaque autem quibusdam enim
        numquam, qui pariatur sit cum! Ipsa inventore tempora nihil omnis
        officiis reprehenderit, laborum non corporis quidem modi aliquam a odit,
        perferendis nulla. Ab, cum mollitia aliquid magnam quo quis veniam
        accusantium nihil quaerat, eveniet labore maiores soluta corrupti
        inventore aspernatur unde ea error libero? Repellat ratione dolor
        officiis itaque consequatur. Cupiditate totam officiis magni accusantium
        possimus ipsum voluptatum rem beatae qui aperiam, commodi, eum quibusdam
        ipsam aspernatur aliquid. Iste.
      </p>
      <br />
      <br />
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat
        corrupti corporis perferendis deserunt voluptas illo, excepturi est
        laudantium magnam. Perspiciatis alias doloremque magnam quidem ratione
        repellendus, nam harum in eveniet repellat modi, necessitatibus nihil
        aliquid aut corporis, laboriosam exercitationem repudiandae expedita
        labore? Quas quidem hic maxime exercitationem enim natus esse id
        similique explicabo, magni consequatur minima, voluptatum optio quia
        molestiae nesciunt tempora sapiente earum commodi vitae, debitis
        aperiam. Dignissimos, alias in ratione quam quos repellendus est
        deserunt, maxime nihil atque consectetur? Et voluptatibus a sed nobis
        laudantium voluptate saepe? Alias, nesciunt numquam incidunt neque,
        error animi repudiandae voluptates debitis id dignissimos modi
        aspernatur eaque quidem aperiam veritatis ipsam repellendus repellat ut
        voluptas libero deleniti blanditiis. Pariatur culpa similique optio,
        tenetur aperiam obcaecati quas id iure corporis voluptatum! Dolor ut
        esse dolore, modi impedit consectetur aliquid, earum quibusdam, tempora
        voluptatem quisquam dolorum nobis. Placeat, numquam molestias ut dolore
        necessitatibus provident at laborum, quos quod doloremque et nulla
        quibusdam fuga officia cumque. Rerum laudantium vero accusantium porro
        omnis, saepe mollitia ratione voluptates tempora, iure quas atque
        corporis repudiandae? Eos numquam dignissimos aliquam, et praesentium
        error quidem unde atque, blanditiis qui laudantium perferendis
        cupiditate, tenetur a laboriosam. Maxime magni nostrum laborum vel qui?
      </p>
      <br />
      <br />

      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt
        cupiditate exercitationem omnis animi optio, perferendis odio. Debitis
        distinctio quod omnis iure numquam? Eligendi ex reiciendis ab, sint
        quidem laborum pariatur repellat ea consequuntur ullam repellendus nam
        saepe impedit tenetur. Inventore totam nemo laboriosam. Nam voluptatum
        eum magni accusamus enim recusandae libero ducimus totam cum placeat
        tempore fugit adipisci ex officia delectus neque voluptate, consectetur,
        labore itaque harum deserunt molestias aperiam quidem dicta! Dolorum
        eius maxime vitae accusamus, officiis ex dolores repudiandae esse
        quaerat corporis illum minus velit ab tempore cumque aut, doloremque
        quae distinctio quis, consequatur illo. Necessitatibus illum
        perspiciatis, accusantium autem quis ratione, exercitationem vitae
        quibusdam temporibus asperiores eligendi? Quaerat dolore recusandae
        tempore neque laborum vitae nesciunt, at ipsam accusantium architecto
        error animi similique facere! In voluptate, voluptates quibusdam atque
        ex inventore doloremque eum vero voluptatibus fugit culpa fugiat earum
        nobis repellendus autem deserunt? Cum, velit iusto! Iste quibusdam
        repellat amet odio dignissimos sint accusamus repellendus cupiditate
        esse quidem repudiandae, beatae neque aliquid recusandae reiciendis
        consequatur laboriosam ratione velit rerum itaque molestias numquam
        commodi a rem. Facere nihil, ab sunt nisi exercitationem quae rerum
        incidunt nam placeat quod? Dolorum repudiandae commodi assumenda nisi,
        necessitatibus minima earum asperiores consectetur aperiam!
      </p>
    </div>
  );
};

export default ScrollAnimation;
