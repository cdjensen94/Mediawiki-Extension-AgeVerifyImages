<?php

namespace AgeVerifyImages;

use Parser;
use PPFrame;

class AgeVerifyHandler {

    // Hook into MediaWiki
    public static function onParserFirstCallInit(Parser $parser) {
        $parser->setHook('ageimage', [self::class, 'renderAgeVerifiedImage']);
        return true;
    }

    // Main function to handle the <ageimage> tag
    public static function renderAgeVerifiedImage($input, array $args, Parser $parser, PPFrame $frame) {
        $imageName = $args['file'] ?? '';
        $ageLimit = $args['age'] ?? 18;

        if (!$imageName) {
            return '<strong>Error:</strong> No image specified.';
        }

        // Parse the wiki markup to display the image properly
        $parsedImage = $parser->recursiveTagParse("[[File:{$imageName}|frameless]]");

        // Create a div that JS can hook into
        $output = <<<HTML
<div class="age-verify-image" data-file="{$imageName}" data-age="{$ageLimit}">
    <button class="verify-age-btn">Click to verify age</button>
    <div class="image-placeholder" style="display:none;">
        {$parsedImage}
    </div>
</div>
HTML;

        // Load JS and CSS resources
        $parser->getOutput()->addModules(['ext.AgeVerifyImages']);
        return $output;
    }
}
