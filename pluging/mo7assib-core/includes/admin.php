<?php
/**
 * Ecran d'administration du plugin.
 *
 * @package Mo7assibCore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Gere les options admin du plugin.
 */
class Mo7assib_Core_Admin {

	/**
	 * Option de remplacement total de la homepage.
	 *
	 * @var string
	 */
	const OPTION_REPLACE_HOMEPAGE = 'mo7assib_core_replace_homepage';

	/**
	 * Option d'utilisation du header/footer du theme.
	 *
	 * @var string
	 */
	const OPTION_USE_THEME_CHROME = 'mo7assib_core_use_theme_chrome';

	/**
	 * Enregistre les hooks admin.
	 *
	 * @return void
	 */
	public function register() {
		add_action( 'admin_init', array( $this, 'register_settings' ) );
		add_action( 'admin_menu', array( $this, 'register_menu_page' ) );
	}

	/**
	 * Enregistre les options du plugin.
	 *
	 * @return void
	 */
	public function register_settings() {
		register_setting(
			'mo7assib_core_settings',
			self::OPTION_REPLACE_HOMEPAGE,
			array(
				'type'              => 'boolean',
				'sanitize_callback' => array( $this, 'sanitize_checkbox' ),
				'default'           => true,
			)
		);

		register_setting(
			'mo7assib_core_settings',
			self::OPTION_USE_THEME_CHROME,
			array(
				'type'              => 'boolean',
				'sanitize_callback' => array( $this, 'sanitize_checkbox' ),
				'default'           => false,
			)
		);
	}

	/**
	 * Ajoute la page de reglage sous "Settings".
	 *
	 * @return void
	 */
	public function register_menu_page() {
		add_options_page(
			__( 'Mo7assib Core', 'mo7assib-core' ),
			__( 'Mo7assib Core', 'mo7assib-core' ),
			'manage_options',
			'mo7assib-core',
			array( $this, 'render_settings_page' )
		);
	}

	/**
	 * Affiche la page de configuration.
	 *
	 * @return void
	 */
	public function render_settings_page() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}
		?>
		<div class="wrap">
			<h1><?php esc_html_e( 'Mo7assib Core', 'mo7assib-core' ); ?></h1>
			<p><?php esc_html_e( 'Controlez le remplacement complet de la homepage WordPress par l interface du plugin.', 'mo7assib-core' ); ?></p>

			<form method="post" action="options.php">
				<?php settings_fields( 'mo7assib_core_settings' ); ?>
				<table class="form-table" role="presentation">
					<tr>
						<th scope="row">
							<label for="<?php echo esc_attr( self::OPTION_REPLACE_HOMEPAGE ); ?>">
								<?php esc_html_e( 'Remplacer completement la homepage', 'mo7assib-core' ); ?>
							</label>
						</th>
						<td>
							<input
								type="checkbox"
								id="<?php echo esc_attr( self::OPTION_REPLACE_HOMEPAGE ); ?>"
								name="<?php echo esc_attr( self::OPTION_REPLACE_HOMEPAGE ); ?>"
								value="1"
								<?php checked( $this->is_replace_homepage_enabled() ); ?>
							/>
							<p class="description"><?php esc_html_e( 'Quand cette option est active, la homepage ignore le template Astra et affiche directement le template du plugin.', 'mo7assib-core' ); ?></p>
						</td>
					</tr>
					<tr>
						<th scope="row">
							<label for="<?php echo esc_attr( self::OPTION_USE_THEME_CHROME ); ?>">
								<?php esc_html_e( 'Conserver header/footer du theme', 'mo7assib-core' ); ?>
							</label>
						</th>
						<td>
							<input
								type="checkbox"
								id="<?php echo esc_attr( self::OPTION_USE_THEME_CHROME ); ?>"
								name="<?php echo esc_attr( self::OPTION_USE_THEME_CHROME ); ?>"
								value="1"
								<?php checked( $this->use_theme_chrome() ); ?>
							/>
							<p class="description"><?php esc_html_e( 'Si active, le plugin garde get_header() et get_footer(). Sinon, il rend une homepage full screen autonome.', 'mo7assib-core' ); ?></p>
						</td>
					</tr>
				</table>
				<?php submit_button(); ?>
			</form>
		</div>
		<?php
	}

	/**
	 * Sanitise un checkbox WordPress.
	 *
	 * @param mixed $value Valeur brute.
	 * @return bool
	 */
	public function sanitize_checkbox( $value ) {
		return ! empty( $value );
	}

	/**
	 * Indique si le remplacement total est actif.
	 *
	 * @return bool
	 */
	public function is_replace_homepage_enabled() {
		return (bool) get_option( self::OPTION_REPLACE_HOMEPAGE, true );
	}

	/**
	 * Indique si le header/footer du theme doit etre conserve.
	 *
	 * @return bool
	 */
	public function use_theme_chrome() {
		return (bool) get_option( self::OPTION_USE_THEME_CHROME, false );
	}
}
